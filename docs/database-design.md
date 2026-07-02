# Tài liệu thiết kế Cơ sở dữ liệu — Hệ thống Quản lý Kho tài sản
> **Công nghệ:** MySQL + Knex.js (migrations trong `be/migrations/`, seed trong `be/seeds/`).
> **Phạm vi:** 22 bảng, chia thành 6 nhóm nghiệp vụ (A–F).
## Mục lục

- [Quy ước chung](#quy-ước-chung)
- [A. Phân quyền & Người dùng (RBAC)](#a-phân-quyền--người-dùng-rbac)
- [B. Danh mục & Tài sản / Kho](#b-danh-mục--tài-sản--kho)
- [C. Giao dịch tài sản](#c-giao-dịch-tài-sản)
- [D. Học vụ & Quy trình duyệt](#d-học-vụ--quy-trình-duyệt)
- [E. Địa chỉ & Đơn vị hành chính](#e-địa-chỉ--đơn-vị-hành-chính)
- [F. Nhật ký hệ thống](#f-nhật-ký-hệ-thống)
- [Bảng tra cứu Enum](#bảng-tra-cứu-enum)
## Quy ước chung
Hầu hết các bảng nghiệp vụ đều dùng chung một bộ cột chuẩn. Để tránh lặp lại, các cột này được mô tả một lần ở đây; trong từng bảng bên dưới chỉ liệt kê cột **đặc thù**.

| Cột | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | int / bigint | Khóa chính, tự tăng (`auto-increment`). |
| `created_by_user_id` | int | **Audit** — ID người dùng đã *tạo* bản ghi (FK → `users.id`). |
| `modified_by_user_id` | int | **Audit** — ID người dùng *sửa* gần nhất. |
| `deleted_by_user_id` | int | **Audit** — ID người dùng đã *xóa mềm* bản ghi. |
| `created_at` | datetime | Thời điểm tạo, mặc định `now()`. |
| `updated_at` | datetime | Thời điểm cập nhật gần nhất. |
| `deleted_at` | datetime | Thời điểm **xóa mềm** (soft delete). `NULL` = chưa xóa. Bản ghi không bị xóa vật lý khỏi DB. |
**Hai nguyên tắc xuyên suốt:**

1. **Soft delete:** Không xóa thật. Khi "xóa", hệ thống ghi `deleted_at` + `deleted_by_user_id`; truy vấn nghiệp vụ luôn lọc `WHERE deleted_at IS NULL`.
2. **Audit trail:** Mọi thao tác tạo/sửa/xóa đều lưu lại *ai* làm, phục vụ truy vết và đối soát.
> **Ngoại lệ:** nhóm **D** (`majors`, `classes`, `students`, `advisor_requests`) và nhóm **F** (log) chỉ có một phần (hoặc không có) các cột chuẩn — xem chi tiết trong từng nhóm.
**Về khóa ngoại (FK):** toàn bộ FK được tạo gộp ở migration cuối (`20260618223000_add_foreign_key_constraints.ts`) với 3 hành vi xóa:
- `CASCADE` — xóa cha thì xóa luôn con (vd xóa giao dịch → xóa dòng chi tiết).
- `SET NULL` — xóa cha thì cột FK ở con thành `NULL` (giữ lại bản ghi con).
- `RESTRICT` — chặn không cho xóa cha nếu còn con tham chiếu.
## A. Phân quyền & Người dùng (RBAC)
### Cách hoạt động
Hệ thống dùng mô hình **RBAC (Role-Based Access Control)**:
```
users  →  roles  →  (role_permissions)  →  permissions
```

- Mỗi **user** được gán **một vai trò** (`role_id`).
- Mỗi **vai trò** sở hữu **nhiều quyền** thông qua bảng nối `role_permissions`.
- Khi user đăng nhập, hệ thống tra ra danh sách quyền của vai trò để quyết định họ được làm gì (thêm tài sản, duyệt yêu cầu, xem báo cáo…).
Ba vai trò mặc định (seed): `admin` (Admin hệ thống), `warehouse-officer` (Cán bộ kho), `commander` (Chỉ huy / Cố vấn học tập).
Ngoài vai trò, **user còn có thể gắn với `class_id` / `major_id`** — dùng cho vai trò *Chỉ huy/Cố vấn* để biết họ phụ trách lớp/ngành nào.
### `users` — Tài khoản hệ thống

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `username` | varchar | Tên đăng nhập. |
| `fullname` | varchar | Họ tên đầy đủ. |
| `phone_number` | varchar | Số điện thoại. |
| `avatar_url` | varchar | Đường dẫn ảnh đại diện. |
| `address` | varchar | Địa chỉ (dạng text tự do). |
| `email` | varchar | Email. |
| `password` | varchar | Mật khẩu đã **băm (hash)**. |
| `failed_login_attempts` | int | Số lần đăng nhập sai liên tiếp — dùng để **khóa chống dò mật khẩu**. Mặc định 0. |
| `last_failed_login_at` | datetime | Thời điểm đăng nhập sai gần nhất. |
| `is_active` | boolean | Trạng thái kích hoạt: `1` = hoạt động, `0` = bị khóa. |
| `role_id` | int | FK → `roles`. Vai trò của user. |
| `class_id` | int | FK → `classes`. Lớp mà Chỉ huy/Cố vấn phụ trách. |
| `major_id` | int | FK → `majors`. Ngành phụ trách. |
### `roles` — Vai trò

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `name` | varchar (unique) | Tên hiển thị (vd "Cán bộ kho"). |
| `code` | varchar (unique) | Mã định danh dùng trong code (`admin`, `warehouse-officer`, `commander`). |
| `description` | varchar | Mô tả. |
### `permissions` — Quyền chi tiết

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `name` | varchar (unique) | Tên quyền. |
| `code` | varchar (unique) | Mã quyền dùng để kiểm tra trong code (vd `ASSET_CREATE`, `REPORT_VIEW`, `COMMANDER_REQUESTS_MANAGE`). |
| `description` | varchar | Mô tả. |
### `role_permissions` — Bảng nối Vai trò ↔ Quyền (N–N)

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `role_id` | int | FK → `roles` (CASCADE). |
| `permission_id` | int | FK → `permissions` (CASCADE). |
> **Khóa chính kép** `(role_id, permission_id)` — mỗi cặp vai trò–quyền chỉ tồn tại một lần. Bảng này **không có cột `id`**.
## B. Danh mục & Tài sản / Kho
### Cách hoạt động
Đây là nơi định nghĩa **tài sản là gì** và **đang nằm ở kho nào, số lượng bao nhiêu**. Điểm mấu chốt là tách 2 khái niệm:

- **`assets`** = *danh mục/loại* tài sản (vd "Máy tính Dell", "Bàn học"). Chỉ mô tả "mặt hàng gì", **không** chứa số lượng tồn.
- **`warehouse_asset`** = *lô tài sản thực tế* trong một kho cụ thể (vd "50 cái Máy tính Dell, lô L001, kho A, tình trạng tốt"). Đây mới là nơi giữ **tồn kho**.
```
categories ──< assets ──< warehouse_asset >── warehouses
                                                  │
                              warehouse_user >─────┘  (Cán bộ kho phụ trách kho nào)
```
Một `asset` có thể có **nhiều lô** (`warehouse_asset`) ở nhiều kho khác nhau, mỗi lô có hạn dùng, giá, tình trạng riêng.
### `categories` — Danh mục tài sản

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `name` | varchar | Tên danh mục. |
| `code` | varchar | Mã danh mục. |
| `description` | varchar | Mô tả. |
| `color` | varchar | Mã màu (hex) để hiển thị nhãn danh mục trên giao diện. |
### `assets` — Loại tài sản (catalog)

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `name` | varchar | Tên tài sản. |
| `code` | varchar | Mã tài sản. |
| `description` | varchar | Mô tả. |
| `image_url` | varchar | Ảnh minh họa. |
| `category_id` | int | FK → `categories` (**RESTRICT** — không cho xóa danh mục khi còn tài sản thuộc nó). |
### `warehouses` — Kho

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `name` | varchar | Tên kho. |
| `code` | varchar | Mã kho. |
| `address_id` | bigint | FK → `address` (SET NULL). Vị trí kho. |
### `warehouse_user` — Phân công Cán bộ kho (N–N)

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `user_id` | int | FK → `users` (CASCADE). |
| `warehouse_id` | int | FK → `warehouses` (CASCADE). |
> Gán một (hoặc nhiều) cán bộ quản lý một kho. **Không có cột `id`.**
### `warehouse_asset` — Tồn kho theo lô ⭐
Bảng trung tâm của tồn kho.

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `asset_id` | int | FK → `assets` (CASCADE). Lô này là loại tài sản nào. |
| `warehouse_id` | int | FK → `warehouses` (CASCADE). Lô đang ở kho nào. |
| `quantity` | int | **Số lượng tồn hiện tại** của lô. Mặc định 0. |
| `batch_code` | varchar | Mã lô hàng. |
| `cost` | int | Đơn giá / chi phí của lô. |
| `status` | int | Tình trạng lô — xem [AssetStatus](#assetstatus): `1` Tốt, `2` Hỏng, `3` Đang bảo trì, `4` Hết hạn. |
| `manufacture_date` | datetime | Ngày sản xuất. |
| `expiration_date` | datetime | Ngày hết hạn. |
| `maintenance_due` | datetime | Ngày đến hạn bảo trì. |
## C. Giao dịch tài sản
### Cách hoạt động
Mọi biến động tài sản (nhập, xuất, cấp phát, thu hồi, thanh lý, bảo trì) đều được ghi nhận theo mô hình **Header – Detail + bảng mở rộng theo loại**:
```
                     asset_transactions  (HEADER chung — mọi giao dịch)
                            │ type
        ┌──────────────┬────┴─────┬──────────────┬───────────────┐
   asset_imports  asset_exports  asset_lifecycle  asset_maintenances   (chi tiết theo LOẠI)
   asset_transactions ──< asset_transaction_items  (các DÒNG hàng + số lượng)
```

- **`asset_transactions`** là phiếu giao dịch chung. Cột `type` quyết định đây là loại gì.
- **`asset_transaction_items`** liệt kê các *dòng hàng* trong phiếu: lô nào (`warehouse_asset_id`), số lượng bao nhiêu. Đây là nơi cập nhật trừ/cộng tồn kho.
- Tùy `type`, hệ thống ghi thêm vào **một** bảng mở rộng tương ứng để lưu thông tin đặc thù:
  - Nhập kho → `asset_imports` (ai gửi, ngày nhận).
  - Xuất kho → `asset_exports` (người nhận, SĐT, địa chỉ).
  - Cấp phát / Thu hồi / Thanh lý → `asset_lifecycle` (ngày cấp, hạn thu hồi, ngày thu hồi, ngày thanh lý).
  - Bảo trì → `asset_maintenances` (ngày bảo trì, trạng thái).
> Mọi bảng con liên kết với header qua `transaction_id` (CASCADE): xóa phiếu → xóa toàn bộ chi tiết liên quan.
### `asset_transactions` — Phiếu giao dịch (Header)

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `code` | varchar | Mã phiếu giao dịch. |
| `name` | varchar | Tên/tiêu đề phiếu. |
| `warehouse_id` | int | FK → `warehouses` (SET NULL). Kho thực hiện giao dịch. |
| `type` | int | **Loại giao dịch** — xem [TransactionType](#transactiontype): `1` Cấp phát/Thu hồi, `2` Thanh lý, `3` Nhập, `4` Xuất, `5` Bảo trì. |
| `note` | varchar | Ghi chú. |
| `reason` | varchar | Lý do thực hiện. |
### `asset_transaction_items` — Dòng hàng của phiếu

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `transaction_id` | int | FK → `asset_transactions` (CASCADE). |
| `warehouse_asset_id` | int | FK → `warehouse_asset` (CASCADE). Lô tồn kho bị tác động. |
| `quantity` | int | Số lượng trong dòng này. |
| `cost` | int | Chi phí của dòng. |
| `status` | int | Trạng thái dòng. Mặc định `1`. |
### `asset_imports` — Chi tiết Nhập kho

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `transaction_id` | int | FK → `asset_transactions` (CASCADE). |
| `received_date` | timestamp | Ngày nhận hàng. |
| `sender_location` | varchar | Nơi gửi / nguồn cung. |
### `asset_exports` — Chi tiết Xuất kho

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `transaction_id` | int | FK → `asset_transactions` (CASCADE). |
| `export_date` | timestamp | Ngày xuất kho. |
| `receiver_name` | varchar | Người nhận. |
| `receiver_phone` | varchar | SĐT người nhận. |
| `receiver_address` | varchar | Địa chỉ người nhận. |
### `asset_lifecycle` — Vòng đời Cấp phát / Thu hồi / Thanh lý

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `transaction_id` | int | FK → `asset_transactions` (CASCADE). |
| `allocation_date` | timestamp | Ngày cấp phát. |
| `return_deadline` | timestamp | Hạn phải thu hồi. |
| `receiver_id` | int | FK → `users` (SET NULL). Người/đơn vị nhận. |
| `return_date` | date | Ngày thực tế thu hồi. |
| `disposal_date` | date | Ngày thanh lý. |
### `asset_maintenances` — Chi tiết Bảo trì

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `transaction_id` | int | FK → `asset_transactions` (CASCADE). |
| `maintenance_date` | date | Ngày bảo trì. |
| `status` | int | Trạng thái — xem [MaintenanceStatus](#maintenancestatus): `0` Đang thực hiện, `1` Hoàn thành. |
## D. Học vụ & Quy trình duyệt
### Cách hoạt động
Phân hệ quản lý cơ cấu học vụ và **quy trình Chỉ huy/Cố vấn xin cấp phát–thu hồi tài sản cho sinh viên**, gửi Cán bộ kho duyệt.
```
majors ──< classes ──< students
   (Ngành)   (Lớp)      (Sinh viên)
advisor_requests  (Yêu cầu) ── status: 0 Chờ → 1 Duyệt / 2 Từ chối
   ├─ advisor_id          → người gửi (Chỉ huy/Cố vấn)
   ├─ processed_by_user_id → người duyệt (Cán bộ kho)
   └─ khi duyệt → sinh giao dịch cấp phát (allocation_transaction_code)
```
**Luồng nghiệp vụ:**
1. Chỉ huy/Cố vấn tạo một `advisor_requests` (loại Cấp phát hoặc Thu hồi) cho sinh viên/lớp, kèm tài sản và số lượng.
2. Yêu cầu ở trạng thái **0 — Chờ duyệt**.
3. Cán bộ kho xem và **duyệt (1)** hoặc **từ chối (2)**, ghi `response_note` và `processed_by_user_id`.
4. Nếu duyệt cấp phát, hệ thống sinh phiếu giao dịch bên nhóm C và lưu mã vào `allocation_transaction_code` để liên kết ngược.
> **Lưu ý thiết kế:** các bảng nhóm D chỉ có `created_at` / `updated_at` (không có cột audit `*_by_user_id` và không soft delete như các nhóm khác). `students` lưu mật khẩu riêng, độc lập với `users`.
### `majors` — Ngành học

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `name` | varchar | Tên ngành. |
| `code` | varchar (unique) | Mã ngành. |
| `description` | text | Mô tả. |
### `classes` — Lớp

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `major_id` | int | FK → `majors` (CASCADE). Lớp thuộc ngành nào. |
| `name` | varchar | Tên lớp. |
| `code` | varchar (unique) | Mã lớp. |
| `description` | text | Mô tả. |
### `students` — Sinh viên

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `class_id` | int | FK → `classes` (CASCADE). Lớp của sinh viên. |
| `student_code` | varchar (unique) | Mã sinh viên. |
| `fullname` | varchar | Họ tên. |
| `email` | varchar (unique) | Email. |
| `password` | varchar | Mật khẩu (hash). |
| `phone_number` | varchar | SĐT. |
| `is_active` | boolean | Còn hoạt động hay không. Mặc định `true`. |
### `advisor_requests` — Yêu cầu cấp phát / thu hồi ⭐

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `advisor_id` | int | FK → `users` (CASCADE). Người gửi yêu cầu (Chỉ huy/Cố vấn). |
| `class_id` | int | FK → `classes` (SET NULL). Lớp liên quan. |
| `student_id` | int | FK → `students` (SET NULL). Sinh viên thụ hưởng (có thể null nếu cấp cho cả lớp). |
| `asset_id` | int | FK → `assets` (SET NULL). Tài sản yêu cầu. |
| `warehouse_id` | int | FK → `warehouses` (SET NULL). Kho dự kiến xuất. |
| `quantity` | int | Số lượng yêu cầu. |
| `type` | int | `1` Cấp phát, `2` Thu hồi. |
| `status` | int | `0` Chờ duyệt, `1` Đã duyệt, `2` Từ chối. Mặc định `0`. |
| `note` | text | Ghi chú của người gửi. |
| `response_note` | text | Phản hồi của người duyệt. |
| `processed_by_user_id` | int | FK → `users` (SET NULL). Người đã xử lý/duyệt. |
| `allocation_transaction_code` | varchar | Mã phiếu giao dịch cấp phát được sinh ra sau khi duyệt (liên kết sang nhóm C). |
## E. Địa chỉ & Đơn vị hành chính
### Cách hoạt động
Cung cấp dữ liệu **địa chỉ** (cho kho) và **danh mục hành chính Việt Nam** theo mô hình 2 cấp Tỉnh – Xã/Phường.
```
administrative_units (loại đơn vị: tỉnh, xã…)
        ▲                    ▲
        │                    │
   provinces ──────────────< wards
   (Tỉnh, PK = code)         (Xã/Phường, PK = code)
```

- `provinces` và `wards` dùng **`code` (chuỗi) làm khóa chính** — đây là mã hành chính chuẩn quốc gia, không phải số tự tăng.
- `administrative_units` phân loại cấp đơn vị (vd "Tỉnh", "Thành phố", "Phường", "Xã"), có tên song ngữ Việt–Anh.
- `address` lưu địa chỉ cụ thể kèm tọa độ, được kho tham chiếu qua `warehouses.address_id`.
### `address` — Địa chỉ chi tiết

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `address_detail` | varchar | Địa chỉ dạng text. |
| `latitude` | decimal(10,7) | Vĩ độ. |
| `longitude` | decimal(10,7) | Kinh độ. |
### `administrative_units` — Loại đơn vị hành chính

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | int | Khóa chính (**không** tự tăng — gán sẵn theo dữ liệu chuẩn). |
| `full_name` / `full_name_en` | varchar | Tên đầy đủ (Việt / Anh). |
| `short_name` / `short_name_en` | varchar | Tên viết tắt (Việt / Anh). |
| `code_name` / `code_name_en` | varchar | Tên mã hóa (Việt / Anh). |
### `provinces` — Tỉnh / Thành phố

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `code` | varchar | **Khóa chính** — mã tỉnh. |
| `name` / `name_en` | varchar | Tên (Việt / Anh). |
| `full_name` / `full_name_en` | varchar | Tên đầy đủ. |
| `code_name` | varchar | Tên mã hóa. |
| `administrative_unit_id` | int | FK → `administrative_units` (SET NULL). Index `idx_provinces_unit`. |
### `wards` — Phường / Xã

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `code` | varchar | **Khóa chính** — mã phường/xã. |
| `name` / `name_en` | varchar | Tên (Việt / Anh). |
| `full_name` / `full_name_en` | varchar | Tên đầy đủ. |
| `code_name` | varchar | Tên mã hóa. |
| `province_code` | varchar | FK → `provinces.code` (SET NULL). Thuộc tỉnh nào. Index `idx_wards_province`. |
| `administrative_unit_id` | int | FK → `administrative_units` (SET NULL). Index `idx_wards_unit`. |
## F. Nhật ký hệ thống
### Cách hoạt động
Ghi lại **mọi hành động quan trọng** của người dùng để phục vụ kiểm toán (audit log). Tách 3 bảng:
```
kqn_logs >── action_id ──> log_actions      (loại hành động: CREATE, EDIT…)
kqn_logs >── controller_id ──> log_controllers (phân hệ: ASSET, USER…)
```

- `log_actions` và `log_controllers` là **bảng danh mục** (chuẩn hóa), tránh lặp chuỗi.
- `kqn_logs` là bản ghi thực tế, dùng `bigint` ID vì khối lượng lớn. Hai cột `data` và `edit_changes` kiểu **JSON** lưu payload và phần dữ liệu thay đổi (trước/sau khi sửa).
> Nhóm này **không** dùng cột audit/soft delete — log là bản ghi chỉ-ghi-thêm (append-only).
### `log_actions` — Danh mục hành động

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `name` | varchar | Tên hành động. |
| `code` | varchar (unique) | Mã: `CREATE`, `EDIT`, `DELETE`, `ACCOUNT`, `Export`, `Import`. |
| `description` | varchar | Mô tả. |
### `log_controllers` — Danh mục phân hệ

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `name` | varchar | Tên phân hệ. |
| `code` | varchar (unique) | Mã: `ASSET`, `USER`, `WAREHOUSE`, `TRANSACTION`, `ALLOCATION`, `CATEGORY`, `ACCESS`, `MAJOR`, `CLASS`, `STUDENT`. |
| `description` | varchar | Mô tả. |
### `kqn_logs` — Bản ghi nhật ký

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `created_at` | timestamp | Thời điểm phát sinh. |
| `username` | varchar | Người thực hiện. |
| `action_id` | bigint | FK → `log_actions` (CASCADE). Hành động gì. |
| `controller_id` | bigint | FK → `log_controllers` (SET NULL). Trên phân hệ nào. |
| `ip` | varchar | Địa chỉ IP. |
| `url` | varchar | Đường dẫn API được gọi. |
| `data` | json | Dữ liệu gửi lên / payload. |
| `edit_changes` | json | Chi tiết thay đổi (diff trước–sau) khi là hành động sửa. |
## Bảng tra cứu Enum
Các cột `type` / `status` lưu **số nguyên**; ý nghĩa được định nghĩa ở tầng code (`be/src/v1/cores/enums/`).
### AssetStatus
*(`warehouse_asset.status`)*

| Giá trị | Ý nghĩa |
|---|---|
| 1 | GOOD — Tốt |
| 2 | BROKEN — Hỏng |
| 3 | MAINTENANCE — Đang bảo trì |
| 4 | EXPIRED — Hết hạn |
### TransactionType
*(`asset_transactions.type`)*

| Giá trị | Ý nghĩa |
|---|---|
| 1 | Cấp phát / Thu hồi (ALLOCATION_RETURN) |
| 2 | Thanh lý (DISPOSAL) |
| 3 | Nhập kho (IMPORT) |
| 4 | Xuất kho (EXPORT) |
| 5 | Bảo trì (MAINTENANCE) |
### MaintenanceStatus
*(`asset_maintenances.status`)*

| Giá trị | Ý nghĩa |
|---|---|
| 0 | IN_PROGRESS — Đang thực hiện |
| 1 | COMPLETED — Hoàn thành |
### UserStatus
*(`users.is_active`)*

| Giá trị | Ý nghĩa |
|---|---|
| 1 | ACTIVE — Hoạt động |
| 0 | INACTIVE — Bị khóa |
### AdvisorRequest — type & status
*(`advisor_requests`)*

| `type` | Ý nghĩa |
|---|---|
| 1 | Cấp phát |
| 2 | Thu hồi |

| `status` | Ý nghĩa |
|---|---|
| 0 | Chờ duyệt |
| 1 | Đã duyệt |
| 2 | Từ chối |
*Tài liệu dựng từ migrations trong `be/migrations/`. Sơ đồ trực quan: xem các file `docs/database*.dbml` và `docs/dbml/*.dbml` (dán vào https://dbdiagram.io/d).*
