# Giải thích nhiệm vụ từng bảng trong CSDL quản lý kho tài sản

Tài liệu này giải thích vai trò của từng bảng theo nhóm nghiệp vụ chính của hệ thống. Mục tiêu là giúp đọc DB không chỉ biết bảng có cột gì, mà còn hiểu bảng đó đại diện cho khái niệm nghiệp vụ nào, được tạo/cập nhật trong luồng nào, quan hệ với bảng nào, và khi truy vấn hoặc sửa code cần chú ý điều gì.

Nguồn đối chiếu chính:

- `docs/database.dbml`: schema tổng đang mô tả DB hiện tại.
- `docs/dbml/*.dbml`: sơ đồ DBML đã tách theo từng nghiệp vụ.
- `be/migrations/*`: migration tạo bảng, khóa ngoại, unique index.
- `be/src/v1/services/*`: cách service đang dùng các bảng trong luồng thực tế.

## 1. Bức tranh tổng thể

Hệ thống hiện có các nhóm nghiệp vụ chính sau:

| Nhóm | Nghiệp vụ | Bảng trung tâm | Ý nghĩa ngắn gọn |
|---|---|---|---|
| A | Người dùng và phân quyền | `users`, `roles`, `permissions`, `role_permission` | Ai được đăng nhập, giữ vai trò gì, có quyền thao tác gì. |
| B | Tài sản, kho và tồn kho | `categories`, `assets`, `warehouses`, `warehouse_asset`, `warehouse_user`, `address` | Định nghĩa tài sản, kho, người phụ trách kho và số lượng tồn thực tế theo lô. |
| C | Giao dịch tài sản | `asset_transactions`, `asset_transaction_items` | Ghi nhận mọi biến động nhập, xuất, cấp phát, thu hồi, thanh lý, bảo trì. |
| D | Học vụ và đề nghị cấp phát/thu hồi | `majors`, `classes`, `students`, `advisor_requests` | Quản lý hệ/ngành, lớp, học viên và yêu cầu của chỉ huy/cố vấn. |
| E | Địa chỉ và hành chính | `address`, `administrative_units`, `provinces`, `wards` | Lưu địa chỉ kho và danh mục hành chính Việt Nam. |
| F | Nhật ký hệ thống | `log_actions`, `log_controllers`, `kqn_logs` | Lưu lại hành động người dùng để audit, tra cứu lịch sử thao tác. |

Một vài nguyên tắc xuyên suốt cần nắm:

- `assets` không phải tồn kho. Đây là danh mục loại tài sản.
- `warehouse_asset` mới là tồn kho thực tế, theo từng lô trong từng kho.
- `asset_transactions` là phiếu giao dịch chung. Muốn biết phiếu gồm những tài sản nào thì đọc `asset_transaction_items`.
- Tùy loại giao dịch, hệ thống đọc thêm bảng phụ: `asset_imports`, `asset_exports`, `asset_lifecycle`, `asset_maintenances`.
- `advisor_requests` là yêu cầu nghiệp vụ trước khi cán bộ kho xử lý. Khi duyệt, có thể sinh giao dịch thật trong nhóm C.
- Nhiều bảng dùng soft delete qua `deleted_at`; cần lọc bản ghi chưa xóa trong query nghiệp vụ nếu repository/service chưa làm sẵn.

## 2. Quy ước chung trong DB

### 2.1. Audit và soft delete

Nhiều bảng nghiệp vụ có các cột:

| Cột | Nhiệm vụ |
|---|---|
| `created_by_user_id` | Lưu user tạo bản ghi. |
| `modified_by_user_id` | Lưu user cập nhật gần nhất. |
| `deleted_by_user_id` | Lưu user xóa mềm bản ghi. |
| `created_at` | Thời điểm tạo. |
| `updated_at` | Thời điểm cập nhật. |
| `deleted_at` | Thời điểm xóa mềm. `NULL` nghĩa là bản ghi vẫn còn hiệu lực. |

Ý nghĩa nghiệp vụ: DB không chỉ lưu dữ liệu hiện tại mà còn lưu dấu vết ai đã tạo/sửa/xóa dữ liệu. Khi làm màn hình danh sách hoặc báo cáo, cần chú ý không lấy nhầm bản ghi đã xóa mềm.

Ngoại lệ:

- `role_permission` không có `id`, không có audit, dùng khóa chính kép.
- `majors`, `classes`, `students`, `advisor_requests` chỉ có `created_at`, `updated_at`, không có bộ `created_by_user_id`, `modified_by_user_id`, `deleted_at`.
- Nhóm log không soft delete; log nên được xem như dữ liệu ghi thêm, phục vụ kiểm toán.

### 2.2. Hành vi khóa ngoại khi xóa

| Hành vi | Ý nghĩa | Ví dụ |
|---|---|---|
| `CASCADE` | Xóa bản ghi cha thì xóa bản ghi con. | Xóa `asset_transactions` sẽ xóa các dòng `asset_transaction_items`, `asset_imports`, `asset_exports`, `asset_lifecycle`, `asset_maintenances` liên quan. |
| `SET NULL` | Xóa bản ghi cha thì cột FK ở bảng con thành `NULL`. | Xóa `warehouses` thì `asset_transactions.warehouse_id` thành `NULL`, phiếu vẫn còn lịch sử. |
| `RESTRICT` | Không cho xóa cha nếu còn con tham chiếu. | Không xóa được `categories` nếu còn `assets` thuộc danh mục đó. |

### 2.3. Tổng hợp ràng buộc khóa ngoại

Mục này là bảng tra nhanh các ràng buộc vật lý đang được mô tả trong `docs/database.dbml` và migration khóa ngoại. Đọc theo chiều: bảng/cột bên trái là bảng con đang giữ khóa ngoại, bảng/cột bên phải là bảng cha được tham chiếu.

Các ràng buộc nghiệp vụ chính:

| Bảng con.cột FK | Bảng cha.cột được tham chiếu | Khi xóa bản ghi cha | Ý nghĩa |
|---|---|---|---|
| `users.role_id` | `roles.id` | `SET NULL` | User có một vai trò chính; xóa role vật lý làm user mất role. |
| `users.class_id` | `classes.id` | `SET NULL` | User có thể gắn với lớp nghiệp vụ. |
| `users.major_id` | `majors.id` | `SET NULL` | User có thể gắn với hệ/ngành nghiệp vụ. |
| `role_permission.role_id` | `roles.id` | `CASCADE` | Dòng phân quyền bị xóa khi role bị xóa. |
| `role_permission.permission_id` | `permissions.id` | `CASCADE` | Dòng phân quyền bị xóa khi permission bị xóa. |
| `classes.major_id` | `majors.id` | `CASCADE` | Lớp thuộc một hệ/ngành. |
| `students.class_id` | `classes.id` | `CASCADE` | Học viên thuộc một lớp. |
| `assets.category_id` | `categories.id` | `RESTRICT` | Tài sản thuộc danh mục; không xóa vật lý danh mục nếu còn tài sản. |
| `warehouses.address_id` | `address.id` | `SET NULL` | Kho có thể có địa chỉ; xóa địa chỉ không xóa kho. |
| `warehouse_user.user_id` | `users.id` | `CASCADE` | Bảng nối user-kho bị xóa khi user bị xóa. |
| `warehouse_user.warehouse_id` | `warehouses.id` | `CASCADE` | Bảng nối user-kho bị xóa khi kho bị xóa. |
| `warehouse_asset.asset_id` | `assets.id` | `CASCADE` | Lô tồn kho thuộc một tài sản. |
| `warehouse_asset.warehouse_id` | `warehouses.id` | `CASCADE` | Lô tồn kho nằm trong một kho. |
| `asset_transactions.warehouse_id` | `warehouses.id` | `SET NULL` | Phiếu giao dịch gắn với kho; xóa kho vẫn giữ phiếu lịch sử. |
| `asset_imports.transaction_id` | `asset_transactions.id` | `CASCADE` | Thông tin nhập kho phụ thuộc phiếu giao dịch. |
| `asset_exports.transaction_id` | `asset_transactions.id` | `CASCADE` | Thông tin xuất kho phụ thuộc phiếu giao dịch. |
| `asset_transaction_items.transaction_id` | `asset_transactions.id` | `CASCADE` | Dòng hàng thuộc phiếu giao dịch. |
| `asset_transaction_items.warehouse_asset_id` | `warehouse_asset.id` | `CASCADE` | Dòng hàng trỏ tới lô tồn kho bị tác động. |
| `asset_lifecycle.transaction_id` | `asset_transactions.id` | `CASCADE` | Dữ liệu cấp phát/thu hồi/thanh lý phụ thuộc phiếu giao dịch. |
| `asset_lifecycle.receiver_id` | `users.id` | `SET NULL` | Người nhận có thể bị xóa vật lý nhưng lịch sử lifecycle vẫn còn. |
| `asset_maintenances.transaction_id` | `asset_transactions.id` | `CASCADE` | Dữ liệu bảo trì phụ thuộc phiếu giao dịch. |
| `advisor_requests.advisor_id` | `users.id` | `CASCADE` | Đề nghị do chỉ huy/cố vấn tạo; xóa user sẽ xóa đề nghị. |
| `advisor_requests.class_id` | `classes.id` | `SET NULL` | Đề nghị có thể gắn với lớp. |
| `advisor_requests.student_id` | `students.id` | `SET NULL` | Đề nghị có thể gắn với học viên. |
| `advisor_requests.asset_id` | `assets.id` | `SET NULL` | Đề nghị có thể gắn với loại tài sản. |
| `advisor_requests.processed_by_user_id` | `users.id` | `SET NULL` | Người xử lý đề nghị là user nội bộ. |
| `advisor_requests.warehouse_id` | `warehouses.id` | `SET NULL` | Đề nghị có thể gắn với kho xử lý. |
| `kqn_logs.action_id` | `log_actions.id` | `CASCADE` | Log gắn với loại hành động. |
| `kqn_logs.controller_id` | `log_controllers.id` | `SET NULL` | Log gắn với nhóm controller, nhưng vẫn giữ log nếu controller bị xóa. |
| `provinces.administrative_unit_id` | `administrative_units.id` | `SET NULL` | Tỉnh/thành gắn với loại đơn vị hành chính. |
| `wards.province_code` | `provinces.code` | `SET NULL` | Xã/phường thuộc tỉnh/thành. |
| `wards.administrative_unit_id` | `administrative_units.id` | `SET NULL` | Xã/phường gắn với loại đơn vị hành chính. |

Các ràng buộc audit về `users`:

| Bảng con | Cột FK | Bảng cha | Khi xóa user | Ý nghĩa |
|---|---|---|---|---|
| `users` | `created_by_user_id`, `modified_by_user_id`, `deleted_by_user_id` | `users.id` | `SET NULL` | User có thể tự tham chiếu user tạo/sửa/xóa. |
| `roles` | `created_by_user_id`, `modified_by_user_id`, `deleted_by_user_id` | `users.id` | `SET NULL` | Audit người tạo/sửa/xóa vai trò. |
| `permissions` | `created_by_user_id`, `modified_by_user_id`, `deleted_by_user_id` | `users.id` | `SET NULL` | Audit người tạo/sửa/xóa quyền. |
| `categories` | `created_by_user_id`, `modified_by_user_id`, `deleted_by_user_id` | `users.id` | `SET NULL` | Audit người tạo/sửa/xóa danh mục tài sản. |
| `assets` | `created_by_user_id`, `modified_by_user_id`, `deleted_by_user_id` | `users.id` | `SET NULL` | Audit người tạo/sửa/xóa tài sản. |
| `address` | `created_by_user_id`, `modified_by_user_id`, `deleted_by_user_id` | `users.id` | `SET NULL` | Audit người tạo/sửa/xóa địa chỉ. |
| `warehouses` | `created_by_user_id`, `modified_by_user_id`, `deleted_by_user_id` | `users.id` | `SET NULL` | Audit người tạo/sửa/xóa kho. |
| `warehouse_user` | `created_by_user_id`, `modified_by_user_id`, `deleted_by_user_id` | `users.id` | `SET NULL` | Audit người tạo/sửa/xóa phân công kho. |
| `warehouse_asset` | `created_by_user_id`, `modified_by_user_id`, `deleted_by_user_id` | `users.id` | `SET NULL` | Audit người tạo/sửa/xóa lô tồn kho. |
| `asset_transactions` | `created_by_user_id`, `modified_by_user_id`, `deleted_by_user_id` | `users.id` | `SET NULL` | Audit người tạo/sửa/xóa phiếu giao dịch. |
| `asset_imports` | `created_by_user_id`, `modified_by_user_id`, `deleted_by_user_id` | `users.id` | `SET NULL` | Audit người tạo/sửa/xóa thông tin nhập kho. |
| `asset_exports` | `created_by_user_id`, `modified_by_user_id`, `deleted_by_user_id` | `users.id` | `SET NULL` | Audit người tạo/sửa/xóa thông tin xuất kho. |
| `asset_transaction_items` | `created_by_user_id`, `modified_by_user_id`, `deleted_by_user_id` | `users.id` | `SET NULL` | Audit người tạo/sửa/xóa dòng hàng giao dịch. |
| `asset_lifecycle` | `created_by_user_id`, `modified_by_user_id`, `deleted_by_user_id` | `users.id` | `SET NULL` | Audit người tạo/sửa/xóa dữ liệu lifecycle. |
| `asset_maintenances` | `created_by_user_id`, `modified_by_user_id`, `deleted_by_user_id` | `users.id` | `SET NULL` | Audit người tạo/sửa/xóa dữ liệu bảo trì. |

Quan hệ nghiệp vụ chưa được DB enforce bằng khóa ngoại:

- `advisor_requests.allocation_transaction_code -> asset_transactions.code`: đây là liên kết theo mã phiếu, không phải FK vật lý trong migration. Service/query phải tự đảm bảo mã giao dịch tồn tại và đúng nghiệp vụ.

Lưu ý thiết kế: các ràng buộc `CASCADE` giúp dữ liệu con không bị mồ côi, nhưng với dữ liệu lịch sử kho như `asset_transactions`, `asset_transaction_items`, `warehouse_asset`, không nên xóa vật lý tùy tiện. Ưu tiên soft delete hoặc chặn xóa ở service nếu bản ghi đã phát sinh lịch sử.

### 2.4. Các mã enum quan trọng

| Cột | Giá trị | Ý nghĩa |
|---|---:|---|
| `users.is_active` | `1` | Hoạt động. |
| `users.is_active` | `0` | Không hoạt động/bị khóa. |
| `warehouse_asset.status`, `asset_transaction_items.status` | `1` | Tốt (`GOOD`). |
| `warehouse_asset.status`, `asset_transaction_items.status` | `2` | Hỏng (`BROKEN`). |
| `warehouse_asset.status`, `asset_transaction_items.status` | `3` | Bảo trì (`MAINTENANCE`). |
| `warehouse_asset.status`, `asset_transaction_items.status` | `4` | Hết hạn (`EXPIRED`). |
| `asset_transactions.type` | `1` | Cấp phát/thu hồi (`ALLOCATION_RETURN`). |
| `asset_transactions.type` | `2` | Thanh lý (`DISPOSAL`). |
| `asset_transactions.type` | `3` | Nhập kho (`IMPORT`). |
| `asset_transactions.type` | `4` | Xuất kho (`EXPORT`). |
| `asset_transactions.type` | `5` | Bảo trì (`MAINTENANCE`). |
| `asset_maintenances.status` | `0` | Đang thực hiện. |
| `asset_maintenances.status` | `1` | Hoàn thành. |
| `advisor_requests.type` | `1` | Đề nghị cấp phát. |
| `advisor_requests.type` | `2` | Đề nghị thu hồi. |
| `advisor_requests.type` | `4` | Yêu cầu khác. |
| `advisor_requests.status` | `0` | Chờ duyệt. |
| `advisor_requests.status` | `1` | Đã duyệt. |
| `advisor_requests.status` | `2` | Từ chối. |

Điểm cần nhớ: trạng thái hiển thị của lô tài sản không phải lúc nào chỉ lấy thẳng từ `warehouse_asset.status`. Code còn suy luận từ `maintenance_due` và `expiration_date`. Ví dụ lô có `status = 1` nhưng `expiration_date` đã qua có thể được hiển thị là hết hạn.

## 3. Nhóm A - Người dùng và phân quyền

Nhóm này trả lời câu hỏi: ai dùng hệ thống, họ thuộc vai trò nào, và họ được phép làm gì.

Mô hình tổng quát:

```text
users -> roles -> role_permission -> permissions
```

Một user có một role chính qua `users.role_id`. Một role có nhiều permission thông qua bảng nối `role_permission`.

### 3.1. `users` - Tài khoản người dùng hệ thống

Nhiệm vụ chính:

- Lưu tài khoản đăng nhập của admin, cán bộ kho, chỉ huy/cố vấn và các user nội bộ khác.
- Lưu thông tin nhận diện: `username`, `fullname`, `email`, `phone_number`, `avatar_url`, `address`.
- Lưu thông tin bảo mật: `password`, `failed_login_attempts`, `last_failed_login_at`, `is_active`.
- Gắn user với vai trò qua `role_id`.
- Gắn user với `major_id` hoặc `class_id` khi user có nghiệp vụ liên quan học vụ.
- Là bảng được rất nhiều bảng khác tham chiếu cho audit: ai tạo, ai sửa, ai xóa.

Cột quan trọng:

| Cột | Ý nghĩa nghiệp vụ |
|---|---|
| `username` | Tên đăng nhập, unique. Không nên cho trùng. |
| `email` | Email, unique. Dùng cho tài khoản và gửi thông tin mật khẩu/reset. |
| `password` | Mật khẩu đã hash. Không lưu plain text. |
| `failed_login_attempts` | Đếm số lần đăng nhập sai liên tiếp. |
| `last_failed_login_at` | Thời điểm đăng nhập sai gần nhất. |
| `is_active` | Bật/tắt tài khoản. User bị khóa không nên đăng nhập/thao tác. |
| `role_id` | Vai trò chính của user. |
| `major_id` | Hệ/ngành mà chỉ huy/cố vấn quản lý. |
| `class_id` | Lớp liên quan nếu nghiệp vụ cần gắn user với lớp. |

Quan hệ chính:

- `users.role_id -> roles.id`.
- `users.major_id -> majors.id`.
- `users.class_id -> classes.id`.
- `warehouse_user.user_id -> users.id`.
- `advisor_requests.advisor_id -> users.id`.
- `advisor_requests.processed_by_user_id -> users.id`.
- `asset_lifecycle.receiver_id -> users.id`.

Khi nào tạo/cập nhật:

- Admin tạo user qua service user.
- Khi tạo user có thể gắn danh sách kho qua `warehouse_user`.
- Nếu user là chỉ huy/cố vấn, code hiện tại yêu cầu có `major_id` và có kho quản lý.
- Khi update user, service có thể cập nhật lại danh sách kho bằng cách xóa/gắn lại `warehouse_user`.

Điểm cần chú ý:

- `students` là bảng học viên riêng, không phải bản ghi trong `users`.
- `users` là tài khoản nhân sự nội bộ; `students` có cơ chế đăng nhập riêng.
- `role_id = 3` trong code đang được hiểu là chỉ huy/cố vấn ở một số service. Đây là phụ thuộc theo seed/role id, cần cẩn thận nếu seed role thay đổi.
- Nhiều bảng audit FK về `users`; xóa user vật lý có thể làm các cột audit thành `NULL`.

### 3.2. `roles` - Vai trò

Nhiệm vụ chính:

- Định nghĩa nhóm vai trò trong hệ thống.
- Gom quyền theo nhóm để gán cho user.
- Giúp code/middleware biết user thuộc nhóm chức năng nào.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `name` | Tên hiển thị của vai trò. |
| `code` | Mã vai trò dùng ổn định trong code/seed, ví dụ `admin`, `warehouse-officer`, `commander`. |
| `description` | Mô tả vai trò. |

Quan hệ chính:

- `users.role_id -> roles.id`.
- `role_permission.role_id -> roles.id`.

Điểm cần chú ý:

- `name` và `code` đều unique.
- Không nên xóa vai trò nếu còn user đang dùng; FK hiện tại `users.role_id` là `SET NULL`, nên user có thể mất vai trò nếu role bị xóa vật lý.
- Tốt nhất dùng soft delete hoặc khóa không cho xóa role quan trọng.

### 3.3. `permissions` - Quyền chi tiết

Nhiệm vụ chính:

- Định nghĩa từng quyền thao tác cụ thể.
- Middleware RBAC kiểm tra permission code để cho phép hoặc chặn API.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `name` | Tên quyền hiển thị. |
| `code` | Mã quyền dùng trong code, ví dụ `ASSET_CREATE`, `ASSET_IMPORT`, `REPORT_VIEW`. |
| `description` | Mô tả quyền. |

Quan hệ chính:

- `role_permission.permission_id -> permissions.id`.

Điểm cần chú ý:

- Permission nên ổn định theo `code`, không nên phụ thuộc vào `id`.
- Khi thêm API mới, cần kiểm tra đã có permission tương ứng và đã gán vào role phù hợp chưa.

### 3.4. `role_permission` - Bảng nối vai trò và quyền

Nhiệm vụ chính:

- Thể hiện quan hệ nhiều-nhiều giữa `roles` và `permissions`.
- Một role có nhiều permission.
- Một permission có thể thuộc nhiều role.

Cấu trúc:

| Cột | Ý nghĩa |
|---|---|
| `role_id` | Vai trò được gán quyền. |
| `permission_id` | Quyền được gán cho vai trò. |

Khóa chính:

- Khóa chính kép `(role_id, permission_id)`.
- Không có cột `id`.

Điểm cần chú ý:

- Không thể có hai dòng trùng cùng một role và permission.
- FK `CASCADE` nghĩa là xóa role hoặc permission sẽ xóa luôn dòng nối liên quan.
- Đây là bảng cấu hình quyền, thường được seed hoặc quản trị bởi admin.

## 4. Nhóm B - Tài sản, kho và tồn kho

Nhóm này trả lời câu hỏi: hệ thống đang quản lý loại tài sản nào, tài sản nằm ở kho nào, số lượng thực tế là bao nhiêu, ai phụ trách kho nào.

Mô hình cần nhớ:

```text
categories -> assets -> warehouse_asset <- warehouses
                              ^
                              |
                         asset_transaction_items

users -> warehouse_user <- warehouses
warehouses -> address
```

### 4.1. `categories` - Danh mục tài sản

Nhiệm vụ chính:

- Phân nhóm tài sản theo loại nghiệp vụ, ví dụ thiết bị, quân trang, vật tư, phương tiện.
- Hỗ trợ lọc/tìm kiếm/thống kê tài sản theo nhóm.
- Cung cấp `color` để giao diện hiển thị nhãn danh mục.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `name` | Tên danh mục, unique. |
| `code` | Mã danh mục, unique. |
| `description` | Mô tả danh mục. |
| `color` | Màu hiển thị trên UI. |

Quan hệ chính:

- `assets.category_id -> categories.id` với `RESTRICT`.

Khi nào tạo/cập nhật:

- Admin hoặc người có quyền quản lý danh mục tạo/sửa/xóa mềm.
- Khi xóa danh mục cần kiểm tra còn tài sản thuộc danh mục không.

Điểm cần chú ý:

- Vì FK `RESTRICT`, không xóa vật lý được category nếu còn `assets`.
- Category không chứa tồn kho. Muốn biết tổng số lượng trong danh mục phải join qua `assets` và `warehouse_asset`.

### 4.2. `assets` - Danh mục loại tài sản

Nhiệm vụ chính:

- Lưu khái niệm "tài sản là gì": tên, mã, mô tả, ảnh, thuộc danh mục nào.
- Là catalog dùng chung cho mọi kho.
- Một `asset` có thể xuất hiện ở nhiều kho, nhiều lô khác nhau.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `name` | Tên tài sản. |
| `code` | Mã tài sản, unique nếu có. |
| `description` | Mô tả tài sản. |
| `image_url` | Ảnh minh họa. |
| `category_id` | Tài sản thuộc danh mục nào. |

Quan hệ chính:

- `assets.category_id -> categories.id`.
- `warehouse_asset.asset_id -> assets.id`.
- `advisor_requests.asset_id -> assets.id`.

Khi nào tạo/cập nhật:

- Tạo khi hệ thống phát sinh một loại tài sản mới cần quản lý.
- Không tăng/giảm số lượng tại bảng này.
- Số lượng chỉ nằm ở `warehouse_asset`.

Điểm cần chú ý:

- Không được hiểu `assets` là từng món tài sản vật lý đơn lẻ. Nó là loại tài sản/catalog.
- Nếu muốn biết tài sản còn bao nhiêu trong kho, phải join `warehouse_asset`.
- Nếu muốn biết tài sản đã giao dịch thế nào, đi qua `warehouse_asset -> asset_transaction_items -> asset_transactions`.

### 4.3. `address` - Địa chỉ chi tiết

Nhiệm vụ chính:

- Lưu địa chỉ cụ thể cho kho.
- Có thể lưu tọa độ để phục vụ bản đồ hoặc định vị.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `address_detail` | Địa chỉ dạng text. |
| `latitude` | Vĩ độ. |
| `longitude` | Kinh độ. |

Quan hệ chính:

- `warehouses.address_id -> address.id`.

Điểm cần chú ý:

- `address` hiện không FK trực tiếp tới `provinces`/`wards`.
- Danh mục hành chính tồn tại riêng, chưa được ràng buộc vật lý vào địa chỉ kho.
- Khi xóa địa chỉ vật lý, `warehouses.address_id` sẽ `SET NULL`.

### 4.4. `warehouses` - Kho

Nhiệm vụ chính:

- Lưu thông tin kho: tên, mã, địa chỉ.
- Là phạm vi quản lý tồn kho và giao dịch.
- Dùng để phân quyền dữ liệu: cán bộ/chỉ huy chỉ thấy hoặc xử lý kho được gán.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `name` | Tên kho, unique. |
| `code` | Mã kho, unique nếu có. |
| `address_id` | Địa chỉ kho. |

Quan hệ chính:

- `warehouse_user.warehouse_id -> warehouses.id`.
- `warehouse_asset.warehouse_id -> warehouses.id`.
- `asset_transactions.warehouse_id -> warehouses.id`.
- `advisor_requests.warehouse_id -> warehouses.id`.

Khi nào tạo/cập nhật:

- Khi tạo kho, service tạo `address` trước, sau đó tạo `warehouses` gắn `address_id`.
- Khi phân công user quản lý kho, dữ liệu được ghi vào `warehouse_user`.

Điểm cần chú ý:

- Kho là trục lọc rất quan trọng. Nhiều API nhận hoặc suy ra `warehouse_id`.
- `asset_transactions.warehouse_id` là kho thực hiện giao dịch.
- `warehouse_asset.warehouse_id` là kho đang giữ lô tồn.
- `advisor_requests.warehouse_id` là kho mà yêu cầu được gửi tới/xử lý.

### 4.5. `warehouse_user` - Phân công user quản lý kho

Nhiệm vụ chính:

- Gắn user với kho mà họ được quản lý hoặc xử lý nghiệp vụ.
- Dùng cho lọc quyền dữ liệu theo kho.
- Một user có thể quản lý nhiều kho, một kho có thể có nhiều user.

Cấu trúc:

| Cột | Ý nghĩa |
|---|---|
| `user_id` | User được phân công. |
| `warehouse_id` | Kho được phân công. |

Khóa chính:

- Khóa chính kép `(user_id, warehouse_id)`.
- Không có `id`.

Luồng sử dụng:

- Khi tạo/cập nhật user, service nhận `warehouse_ids` rồi ghi vào bảng này.
- Khi cán bộ kho xem yêu cầu, repository lọc `advisor_requests.warehouse_id` theo danh sách kho trong `warehouse_user`.
- Khi chỉ huy/cố vấn tạo yêu cầu, code lấy kho đầu tiên trong `warehouse_ids` để gắn vào request.

Điểm cần chú ý:

- Đây là bảng phân quyền dữ liệu theo kho, không phải bảng tồn kho.
- Xóa user hoặc kho vật lý sẽ cascade xóa dòng phân công.
- Nếu user không có dòng `warehouse_user`, nhiều màn hình nghiệp vụ theo kho sẽ không có dữ liệu hoặc không cho thao tác.

### 4.6. `warehouse_asset` - Tồn kho thực tế theo lô

Nhiệm vụ chính:

- Đây là bảng trung tâm của tồn kho.
- Mỗi dòng đại diện cho một lô tài sản cụ thể trong một kho.
- Lưu số lượng hiện tại, mã lô, tình trạng, giá trị, hạn sử dụng, hạn bảo trì.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `asset_id` | Loại tài sản của lô. |
| `warehouse_id` | Kho đang giữ lô. |
| `quantity` | Số lượng tồn hiện tại của lô trong kho. |
| `batch_code` | Mã lô, unique toàn hệ thống. |
| `status` | Trạng thái lưu trữ của lô. |
| `cost` | Giá/chi phí của lô. |
| `manufacture_date` | Ngày sản xuất. |
| `expiration_date` | Hạn sử dụng. |
| `maintenance_due` | Ngày đến hạn bảo trì. |

Quan hệ chính:

- `warehouse_asset.asset_id -> assets.id`.
- `warehouse_asset.warehouse_id -> warehouses.id`.
- `asset_transaction_items.warehouse_asset_id -> warehouse_asset.id`.

Khi nào tạo/cập nhật:

- Nhập kho không có `batch_code` cũ: tạo dòng `warehouse_asset` mới với mã lô sinh tự động.
- Nhập kho có `batch_code` cũ: cộng thêm `quantity` vào dòng lô hiện có.
- Xuất kho/cấp phát/thanh lý/bảo trì: trừ `quantity`.
- Thu hồi hoặc hoàn thành bảo trì: cộng lại `quantity`, có thể cập nhật `status`, có thể tạo lô mới nếu trạng thái trả về khác trạng thái lô cũ.

Điểm cần chú ý:

- Không nên sửa tay `quantity` nếu không tạo giao dịch tương ứng, vì sẽ lệch lịch sử.
- `batch_code` unique nên một mã lô chỉ trỏ tới một dòng.
- `status` có thể bị code hiển thị khác dựa trên `expiration_date` và `maintenance_due`.
- Khi bảo trì, code trừ số lượng khỏi lô và set lô sang trạng thái bảo trì.
- Khi hoàn thành bảo trì, code trả số lượng về lô cũ hoặc tạo lô mới theo trạng thái sau bảo trì.
- Khi thu hồi cấp phát, code cũng có thể trả số lượng về lô cũ hoặc tạo lô mới nếu trạng thái trả về khác.

## 5. Nhóm C - Giao dịch tài sản

Nhóm này trả lời câu hỏi: tài sản đã biến động như thế nào, ai thao tác, ở kho nào, với số lượng nào.

Mô hình tổng quát:

```text
asset_transactions
  ├─ asset_transaction_items
  ├─ asset_imports
  ├─ asset_exports
  ├─ asset_lifecycle
  └─ asset_maintenances
```

`asset_transactions` là header chung. `asset_transaction_items` là danh sách dòng hàng. Các bảng còn lại lưu thông tin riêng theo loại giao dịch.

### 5.1. `asset_transactions` - Phiếu giao dịch/header

Nhiệm vụ chính:

- Lưu thông tin chung của mọi phiếu giao dịch tài sản.
- Là điểm bắt đầu để truy lịch sử nhập, xuất, cấp phát, thu hồi, thanh lý, bảo trì.
- `type` quyết định bảng phụ nào cần đọc thêm.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `code` | Mã phiếu giao dịch, unique. |
| `name` | Tên/tiêu đề phiếu. |
| `warehouse_id` | Kho thực hiện giao dịch. |
| `type` | Loại giao dịch. |
| `note` | Ghi chú. |
| `reason` | Lý do thực hiện. |

Quan hệ chính:

- `asset_transactions.warehouse_id -> warehouses.id`.
- `asset_transaction_items.transaction_id -> asset_transactions.id`.
- `asset_imports.transaction_id -> asset_transactions.id`.
- `asset_exports.transaction_id -> asset_transactions.id`.
- `asset_lifecycle.transaction_id -> asset_transactions.id`.
- `asset_maintenances.transaction_id -> asset_transactions.id`.

Khi nào tạo:

- Nhập kho thủ công/Excel: tạo `type = 3`.
- Xuất kho thủ công/Excel: tạo `type = 4`.
- Cấp phát: tạo `type = 1`.
- Thu hồi: hiện code xử lý thu hồi bằng cách cập nhật lại lifecycle của phiếu cấp phát hoặc fallback nhập kho tùy luồng.
- Thanh lý: tạo `type = 2`.
- Bảo trì: tạo `type = 5`.

Điểm cần chú ý:

- `code` là khóa nghiệp vụ rất quan trọng. Một số chỗ liên kết bằng `code`, không chỉ bằng `id`.
- Khi đọc chi tiết giao dịch phải xem `type` để join đúng bảng phụ.
- Xóa vật lý header sẽ cascade xóa nhiều bảng con, nên cần cực kỳ hạn chế xóa vật lý giao dịch.

### 5.2. `asset_transaction_items` - Dòng tài sản trong phiếu

Nhiệm vụ chính:

- Lưu các lô tài sản bị tác động trong một phiếu giao dịch.
- Mỗi dòng cho biết phiếu tác động tới `warehouse_asset_id` nào, số lượng bao nhiêu, chi phí/trạng thái ra sao.
- Là cầu nối giữa lịch sử giao dịch và tồn kho thực tế.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `transaction_id` | Phiếu giao dịch cha. |
| `warehouse_asset_id` | Lô tồn kho bị tác động. |
| `quantity` | Số lượng giao dịch trên lô đó. |
| `cost` | Chi phí/giá trị của dòng. |
| `status` | Trạng thái dòng, đặc biệt quan trọng khi thu hồi/bảo trì trả về. |

Khi nào tạo/cập nhật:

- Khi nhập: tạo dòng ghi nhận lô được nhập.
- Khi xuất/cấp phát/thanh lý/bảo trì: tạo dòng ghi nhận lô bị trừ.
- Khi thu hồi hoặc hoàn thành bảo trì: có thể update `warehouse_asset_id` sang lô mới nếu trả về thành trạng thái khác.
- Khi thu hồi hoặc hoàn thành bảo trì: update `status` của dòng để phản ánh trạng thái sau xử lý.

Điểm cần chú ý:

- Bảng này không tự làm tăng/giảm tồn. Service vừa ghi bảng này vừa cập nhật `warehouse_asset.quantity`.
- Đây là bảng rất quan trọng cho báo cáo, vì nó nói rõ giao dịch gồm những tài sản/lô nào.
- Nếu `warehouse_asset_id` bị cascade xóa do xóa lô vật lý, lịch sử dòng giao dịch sẽ bị xóa theo. Vì vậy không nên xóa vật lý lô đã có lịch sử.

### 5.3. `asset_imports` - Thông tin riêng của nhập kho

Nhiệm vụ chính:

- Lưu phần thông tin chỉ có trong giao dịch nhập kho.
- Bổ sung cho header `asset_transactions` khi `type = 3`.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `transaction_id` | Phiếu nhập tương ứng. |
| `received_date` | Ngày nhận hàng. |
| `sender_location` | Nguồn gửi/nơi gửi. |

Luồng nghiệp vụ:

1. Tạo `asset_transactions` với `type = 3`.
2. Tạo `asset_imports`.
3. Với từng item, cập nhật hoặc tạo `warehouse_asset`.
4. Tạo `asset_transaction_items` cho từng dòng.

Điểm cần chú ý:

- Không đọc riêng `asset_imports` nếu không join về `asset_transactions`, vì header mới có `code`, `warehouse_id`, `reason`, `note`.
- Nếu nhập vào batch cũ, tồn kho được cộng vào dòng `warehouse_asset` cũ.
- Nếu nhập batch mới, hệ thống tạo dòng `warehouse_asset` mới.

### 5.4. `asset_exports` - Thông tin riêng của xuất kho

Nhiệm vụ chính:

- Lưu phần thông tin chỉ có trong giao dịch xuất kho.
- Bổ sung cho header `asset_transactions` khi `type = 4`.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `transaction_id` | Phiếu xuất tương ứng. |
| `export_date` | Ngày xuất kho. |
| `receiver_name` | Người/đơn vị nhận. |
| `receiver_phone` | Số điện thoại người nhận. |
| `receiver_address` | Địa chỉ người nhận. |

Luồng nghiệp vụ:

1. Tạo `asset_transactions` với `type = 4`.
2. Tạo `asset_exports`.
3. Kiểm tra từng `batch_code` có tồn tại trong kho và đủ số lượng.
4. Trừ `warehouse_asset.quantity`.
5. Tạo `asset_transaction_items`.

Điểm cần chú ý:

- Xuất kho làm giảm tồn thực tế.
- Cần kiểm tra `warehouse_id + batch_code`, không chỉ `batch_code`, để tránh xuất nhầm kho.
- Nếu số lượng lô không đủ, service chặn giao dịch.

### 5.5. `asset_lifecycle` - Cấp phát, thu hồi, thanh lý

Nhiệm vụ chính:

- Lưu thông tin vòng đời của giao dịch cấp phát/thu hồi/thanh lý.
- Bổ sung cho `asset_transactions` khi `type = 1` hoặc `type = 2`.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `transaction_id` | Phiếu giao dịch liên quan. |
| `allocation_date` | Ngày cấp phát. |
| `return_deadline` | Hạn phải thu hồi/trả. |
| `receiver_id` | User nhận tài sản. |
| `return_date` | Ngày thu hồi thực tế. |
| `disposal_date` | Ngày thanh lý. |

Luồng cấp phát:

1. Tạo `asset_transactions` với `type = 1`.
2. Tạo `asset_lifecycle` với `allocation_date`, `return_deadline`, `receiver_id`.
3. Trừ tồn ở `warehouse_asset`.
4. Ghi các dòng vào `asset_transaction_items`.

Luồng thu hồi:

1. Tìm phiếu cấp phát bằng `asset_transactions.code`.
2. Kiểm tra có `asset_lifecycle` và có `return_deadline`.
3. Với từng batch, lấy số lượng đã cấp từ `asset_transaction_items`.
4. Cộng lại vào `warehouse_asset` hoặc tạo batch mới nếu trạng thái trả về khác.
5. Cập nhật `asset_lifecycle.return_date`.

Luồng thanh lý:

1. Tạo `asset_transactions` với `type = 2`.
2. Tạo `asset_lifecycle` với `disposal_date`.
3. Trừ tồn ở `warehouse_asset`.
4. Ghi `asset_transaction_items`.

Điểm cần chú ý:

- `asset_lifecycle` đang dùng chung cho nhiều ý nghĩa: cấp phát, thu hồi, thanh lý.
- `return_date IS NULL` thường được hiểu là tài sản đang còn cấp phát/chưa thu hồi.
- `receiver_id` trỏ tới `users`, không trỏ tới `students`.
- Nếu muốn biết học viên/lớp nào liên quan yêu cầu, phải xem thêm `advisor_requests`.

### 5.6. `asset_maintenances` - Thông tin riêng của bảo trì

Nhiệm vụ chính:

- Lưu thông tin giao dịch bảo trì.
- Bổ sung cho `asset_transactions` khi `type = 5`.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `transaction_id` | Phiếu bảo trì tương ứng. |
| `maintenance_date` | Ngày bắt đầu/lập bảo trì. |
| `status` | Trạng thái bảo trì: đang thực hiện hoặc hoàn thành. |

Luồng tạo bảo trì:

1. Tạo `asset_transactions` với `type = 5`.
2. Tạo `asset_maintenances` với `status = 0`.
3. Trừ số lượng khỏi `warehouse_asset`.
4. Set batch sang `AssetStatusEnum.MAINTENANCE`.
5. Ghi `asset_transaction_items`.

Luồng hoàn thành bảo trì:

1. Tìm phiếu bảo trì theo `transaction_code`.
2. Với từng batch, xác định số lượng đang bảo trì từ `asset_transaction_items`.
3. Cộng lại tồn vào lô cũ hoặc tạo lô mới nếu trạng thái sau bảo trì khác.
4. Cập nhật `warehouse_asset.status`, `maintenance_due`.
5. Cập nhật `asset_maintenances.status = 1`.
6. Code hiện tại còn tự động duyệt một số `advisor_requests` loại thu hồi nếu tài sản đã hoàn thành bảo trì.

Điểm cần chú ý:

- `asset_maintenances.status` là trạng thái của phiếu bảo trì, khác với `warehouse_asset.status`.
- `warehouse_asset.status = 3` là trạng thái lô/tài sản đang bảo trì hoặc cần bảo trì.
- Khi báo cáo bảo trì cần join cả `asset_transactions`, `asset_maintenances`, `asset_transaction_items`, `warehouse_asset`, `assets`.

## 6. Nhóm D - Học vụ và đề nghị cấp phát/thu hồi

Nhóm này trả lời câu hỏi: chỉ huy/cố vấn quản lý hệ/lớp/học viên nào, họ gửi yêu cầu cấp phát/thu hồi tài sản gì, và cán bộ kho xử lý ra sao.

Mô hình tổng quát:

```text
majors -> classes -> students

users(advisor/commander) -> advisor_requests <- assets
advisor_requests -> warehouses
advisor_requests -> users(processed_by_user_id)
```

### 6.1. `majors` - Hệ/ngành quản lý

Nhiệm vụ chính:

- Lưu hệ/ngành/khối quản lý học vụ.
- Là phạm vi để chỉ huy/cố vấn quản lý lớp và học viên.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `name` | Tên hệ/ngành. |
| `code` | Mã hệ/ngành, unique. |
| `description` | Mô tả. |

Quan hệ chính:

- `classes.major_id -> majors.id`.
- `users.major_id -> majors.id`.

Luồng sử dụng:

- Khi tạo user chỉ huy/cố vấn, service kiểm tra `major_id` có tồn tại.
- Khi chỉ huy tạo request cho học viên/lớp, service kiểm tra lớp/học viên có thuộc `major_id` của chỉ huy không.

Điểm cần chú ý:

- `majors` không có soft delete/audit user như nhiều bảng khác.
- Xóa major vật lý sẽ cascade xóa classes theo FK, và từ đó có thể cascade students. Cần tránh xóa vật lý nếu đã có dữ liệu nghiệp vụ.

### 6.2. `classes` - Lớp

Nhiệm vụ chính:

- Lưu lớp học/đơn vị học viên thuộc một hệ/ngành.
- Là cầu nối giữa `majors` và `students`.
- Là phạm vi chọn khi chỉ huy/cố vấn tạo yêu cầu cho cả lớp hoặc cho học viên trong lớp.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `major_id` | Lớp thuộc hệ/ngành nào. |
| `name` | Tên lớp. |
| `code` | Mã lớp, unique. |
| `description` | Mô tả. |

Quan hệ chính:

- `classes.major_id -> majors.id`.
- `students.class_id -> classes.id`.
- `users.class_id -> classes.id`.
- `advisor_requests.class_id -> classes.id`.

Điểm cần chú ý:

- `class_id` trong `advisor_requests` giúp biết yêu cầu thuộc lớp nào.
- Nếu request cho một học viên cụ thể, service tự suy ra `class_id` từ `students.class_id`.
- Xóa class vật lý sẽ cascade students, nhưng `advisor_requests.class_id` là `SET NULL`.

### 6.3. `students` - Học viên/sinh viên

Nhiệm vụ chính:

- Lưu thông tin học viên: mã, họ tên, email, mật khẩu, số điện thoại, trạng thái.
- Dùng trong yêu cầu cấp phát/thu hồi của chỉ huy/cố vấn.
- Có luồng đăng nhập riêng qua student auth.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `class_id` | Học viên thuộc lớp nào. |
| `student_code` | Mã học viên, unique. |
| `fullname` | Họ tên. |
| `email` | Email, unique. |
| `password` | Mật khẩu đã hash. |
| `phone_number` | Số điện thoại. |
| `is_active` | Trạng thái tài khoản học viên. |

Quan hệ chính:

- `students.class_id -> classes.id`.
- `advisor_requests.student_id -> students.id`.

Điểm cần chú ý:

- `students` không phải `users`. Đây là hai hệ tài khoản khác nhau.
- `asset_lifecycle.receiver_id` trỏ tới `users`, không trỏ trực tiếp tới `students`.
- Nếu muốn quản lý tài sản theo học viên cụ thể, cần xem `advisor_requests.student_id` cùng các giao dịch được sinh ra.

### 6.4. `advisor_requests` - Yêu cầu cấp phát, thu hồi hoặc yêu cầu khác

Nhiệm vụ chính:

- Lưu đề nghị từ chỉ huy/cố vấn gửi tới kho.
- Là bước nghiệp vụ trước khi tạo/cập nhật giao dịch thật.
- Cho cán bộ kho biết yêu cầu nào đang chờ, thuộc lớp/học viên/tài sản/kho nào.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `advisor_id` | User gửi yêu cầu. |
| `warehouse_id` | Kho xử lý yêu cầu. |
| `class_id` | Lớp liên quan. |
| `student_id` | Học viên liên quan, có thể null nếu yêu cầu cho cả lớp. |
| `asset_id` | Tài sản được yêu cầu, có thể null với yêu cầu khác. |
| `quantity` | Số lượng yêu cầu, có thể null với yêu cầu khác. |
| `type` | Loại yêu cầu: cấp phát, thu hồi, khác. |
| `status` | Trạng thái xử lý: chờ, duyệt, từ chối. |
| `note` | Ghi chú từ người gửi. |
| `response_note` | Phản hồi của người xử lý. |
| `processed_by_user_id` | User đã xử lý yêu cầu. |
| `allocation_transaction_code` | Mã giao dịch cấp phát liên quan, liên kết nghiệp vụ sang `asset_transactions.code`. |

Luồng tạo yêu cầu:

1. Chỉ huy/cố vấn gửi request.
2. Service kiểm tra `type` phải thuộc `1`, `2`, `4`.
3. Nếu không phải yêu cầu khác (`type != 4`) thì phải có danh sách `items`.
4. Service kiểm tra user gửi yêu cầu có `major_id`.
5. Service kiểm tra user có kho quản lý trong `warehouse_user`.
6. Service kiểm tra lớp/học viên thuộc `major_id` của user.
7. Nếu gửi nhiều tài sản, hệ thống tạo nhiều dòng `advisor_requests`, mỗi dòng ứng với một asset/quantity.

Luồng xử lý yêu cầu:

- Từ chối: cập nhật `status = 2`, ghi `response_note`, `processed_by_user_id`.
- Duyệt thường: cập nhật `status = 1`, ghi người xử lý.
- Duyệt cấp phát: gọi `TransactionService.createAllocation`, tạo phiếu cấp phát thật rồi cập nhật request.
- Duyệt thu hồi: có thể xử lý theo `transaction_codes` để gọi `processReturn`, hoặc fallback nhập kho theo luồng cũ.

Điểm cần chú ý:

- Một "lần gửi yêu cầu nhiều tài sản" không nhất thiết là một dòng. Code hiện tại tách thành nhiều dòng.
- `allocation_transaction_code` không có FK vật lý tới `asset_transactions.code`; đây là quan hệ nghiệp vụ. DB không tự đảm bảo mã này tồn tại.
- `advisor_requests` không có soft delete.
- `type = 4` là yêu cầu khác, có thể không có `asset_id`/`quantity`.
- Nếu user không có kho trong `warehouse_user`, không tạo/xử lý request theo kho được.

## 7. Nhóm E - Địa chỉ và đơn vị hành chính

Nhóm này gồm hai phần hơi khác nhau: địa chỉ kho thực tế (`address`) và danh mục hành chính Việt Nam (`administrative_units`, `provinces`, `wards`).

### 7.1. `administrative_units` - Loại đơn vị hành chính

Nhiệm vụ chính:

- Lưu loại đơn vị hành chính, ví dụ tỉnh, thành phố, phường, xã.
- Là bảng danh mục chuẩn để `provinces` và `wards` tham chiếu.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `id` | Khóa chính, không auto increment theo DBML. |
| `full_name`, `full_name_en` | Tên đầy đủ tiếng Việt/Anh. |
| `short_name`, `short_name_en` | Tên ngắn tiếng Việt/Anh. |
| `code_name`, `code_name_en` | Tên mã hóa tiếng Việt/Anh. |

Quan hệ chính:

- `provinces.administrative_unit_id -> administrative_units.id`.
- `wards.administrative_unit_id -> administrative_units.id`.

Điểm cần chú ý:

- Đây là dữ liệu danh mục chuẩn, thường seed sẵn.
- Không nên sửa/xóa tùy tiện vì ảnh hưởng danh mục tỉnh/xã.

### 7.2. `provinces` - Tỉnh/thành phố

Nhiệm vụ chính:

- Lưu tỉnh/thành phố.
- Là cấp cha của `wards`.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `code` | Mã tỉnh/thành, khóa chính dạng chuỗi. |
| `name`, `name_en` | Tên ngắn tiếng Việt/Anh. |
| `full_name`, `full_name_en` | Tên đầy đủ tiếng Việt/Anh. |
| `code_name` | Tên mã hóa. |
| `administrative_unit_id` | Loại đơn vị hành chính. |

Quan hệ chính:

- `wards.province_code -> provinces.code`.

Điểm cần chú ý:

- Khóa chính là `code`, không phải `id`.
- `administrative_unit_id` có index để tra cứu nhanh theo loại đơn vị.
- Hiện chưa nối trực tiếp với `address`.

### 7.3. `wards` - Phường/xã

Nhiệm vụ chính:

- Lưu phường/xã thuộc tỉnh/thành phố.
- Phục vụ chọn địa chỉ hoặc chuẩn hóa địa bàn nếu UI/API dùng danh mục này.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `code` | Mã phường/xã, khóa chính dạng chuỗi. |
| `province_code` | Mã tỉnh/thành cha. |
| `name`, `name_en` | Tên ngắn tiếng Việt/Anh. |
| `full_name`, `full_name_en` | Tên đầy đủ tiếng Việt/Anh. |
| `administrative_unit_id` | Loại đơn vị hành chính. |

Quan hệ chính:

- `wards.province_code -> provinces.code`.
- `wards.administrative_unit_id -> administrative_units.id`.

Điểm cần chú ý:

- Có index theo `province_code` để lấy danh sách xã/phường theo tỉnh.
- Hiện không FK với `address`, nên địa chỉ kho vẫn là text tự do.

### 7.4. `address` trong nhóm E và nhóm B

`address` đã được mô tả trong nhóm B vì hiện tại nó phục vụ trực tiếp cho `warehouses`. Nếu sau này muốn địa chỉ chuẩn hóa theo tỉnh/xã, có thể cần thêm cột như `province_code`, `ward_code` vào `address`.

## 8. Nhóm F - Nhật ký hệ thống

Nhóm này trả lời câu hỏi: ai đã làm gì, ở phân hệ nào, gọi URL nào, dữ liệu gửi lên là gì, thay đổi gì.

Mô hình:

```text
log_actions <- kqn_logs -> log_controllers
```

### 8.1. `log_actions` - Danh mục hành động

Nhiệm vụ chính:

- Chuẩn hóa loại hành động trong log.
- Tránh lưu chuỗi hành động lặp lại trực tiếp ở mọi dòng log.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `name` | Tên hành động. |
| `code` | Mã hành động, unique. |
| `description` | Mô tả. |

Ví dụ code:

- `CREATE`
- `EDIT`
- `DELETE`
- `ACCOUNT`
- `Export`
- `Import`

Điểm cần chú ý:

- `kqn_logs.action_id` là FK bắt buộc.
- Xóa action vật lý sẽ cascade xóa log liên quan, điều này không tốt cho audit. Nên hạn chế xóa vật lý action đã dùng.

### 8.2. `log_controllers` - Danh mục phân hệ

Nhiệm vụ chính:

- Chuẩn hóa phân hệ/chức năng nơi hành động xảy ra.
- Giúp lọc log theo module: user, asset, warehouse, transaction, allocation...

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `name` | Tên phân hệ. |
| `code` | Mã phân hệ, unique. |
| `description` | Mô tả. |

Ví dụ code:

- `ALLOCATION`
- `USER`
- `TRANSACTION`
- `CATEGORY`
- `ASSET`
- `WAREHOUSE`
- `ACCESS`
- `MAJOR`
- `CLASS`
- `STUDENT`

Điểm cần chú ý:

- `kqn_logs.controller_id` có thể `SET NULL` nếu controller bị xóa.
- Tốt hơn nên giữ ổn định danh mục controller để log còn ý nghĩa.

### 8.3. `kqn_logs` - Bản ghi nhật ký

Nhiệm vụ chính:

- Lưu từng hành động thực tế của người dùng.
- Phục vụ kiểm toán, tra cứu lịch sử, điều tra lỗi hoặc truy vết thao tác.

Cột quan trọng:

| Cột | Ý nghĩa |
|---|---|
| `created_at` | Thời điểm phát sinh log. |
| `username` | Người thực hiện. |
| `action_id` | Hành động gì. |
| `controller_id` | Thuộc phân hệ nào. |
| `ip` | IP gọi API. |
| `url` | URL/API được gọi. |
| `data` | Payload/dữ liệu gửi lên, dạng JSON. |
| `edit_changes` | Diff thay đổi trước/sau, dạng JSON. |

Điểm cần chú ý:

- Log là dữ liệu nhạy cảm vì có thể chứa payload.
- Không nên lưu mật khẩu, token, thông tin bí mật vào `data`.
- Bảng này dùng `bigint` vì log có thể tăng nhanh.
- Không có soft delete; nên xem log như append-only.

## 9. Luồng nghiệp vụ quan trọng và bảng bị tác động

### 9.1. Tạo user và phân quyền kho

Bảng liên quan:

- `users`
- `roles`
- `warehouse_user`
- `kqn_logs`

Luồng:

1. Kiểm tra `role_id` tồn tại trong `roles`.
2. Kiểm tra email/username chưa trùng.
3. Hash password.
4. Tạo dòng `users`.
5. Nếu có danh sách kho, tạo nhiều dòng `warehouse_user`.
6. Gửi email thông tin tài khoản.
7. Ghi log nếu luồng controller/service có gọi log.

Điểm dễ lỗi:

- User có vai trò chỉ huy/cố vấn nhưng không có `major_id` hoặc không có kho thì không tạo request được.
- Nếu cập nhật user mà xóa hết `warehouse_user`, user có thể mất quyền xem/xử lý dữ liệu kho.

### 9.2. Tạo tài sản và nhập kho

Bảng liên quan:

- `categories`
- `assets`
- `warehouses`
- `warehouse_asset`
- `asset_transactions`
- `asset_imports`
- `asset_transaction_items`

Luồng:

1. Tài sản phải tồn tại trong `assets`.
2. Kho phải tồn tại trong `warehouses`.
3. Tạo header `asset_transactions` với `type = 3`.
4. Tạo `asset_imports`.
5. Nếu batch đã có trong kho, cộng số lượng vào `warehouse_asset`.
6. Nếu batch mới, tạo dòng `warehouse_asset`.
7. Tạo `asset_transaction_items` để lưu lịch sử dòng nhập.

Điểm dễ lỗi:

- Nhập không tạo giao dịch sẽ làm tồn có số lượng nhưng không có lịch sử.
- Nhập batch cũ nhưng sai kho sẽ không tìm thấy batch.
- `batch_code` unique toàn hệ thống nên không thể dùng cùng mã cho hai dòng khác nhau.

### 9.3. Xuất kho

Bảng liên quan:

- `warehouse_asset`
- `asset_transactions`
- `asset_exports`
- `asset_transaction_items`

Luồng:

1. Tạo header `asset_transactions` với `type = 4`.
2. Tạo `asset_exports`.
3. Từng item kiểm tra batch tồn tại trong kho.
4. Kiểm tra đủ số lượng.
5. Trừ `warehouse_asset.quantity`.
6. Ghi dòng `asset_transaction_items`.

Điểm dễ lỗi:

- Nếu chỉ dựa vào `asset_id` mà không dựa vào `batch_code`, có thể xuất sai lô.
- Nếu không kiểm tra số lượng âm, tồn kho sẽ bị sai.

### 9.4. Cấp phát tài sản

Bảng liên quan:

- `asset_transactions`
- `asset_lifecycle`
- `asset_transaction_items`
- `warehouse_asset`
- Có thể liên quan `advisor_requests`.

Luồng:

1. Tạo header `asset_transactions` với `type = 1`.
2. Tạo `asset_lifecycle` với người nhận, ngày cấp, hạn trả.
3. Kiểm tra từng batch đủ số lượng.
4. Trừ tồn trong `warehouse_asset`.
5. Ghi `asset_transaction_items`.
6. Nếu cấp phát từ yêu cầu, cập nhật `advisor_requests.status`.

Điểm dễ lỗi:

- `receiver_id` là user, không phải student.
- Muốn biết request gốc cho học viên nào, cần đọc `advisor_requests`.
- Nếu không có `return_deadline`, luồng thu hồi hiện tại có thể chặn.

### 9.5. Thu hồi tài sản đã cấp phát

Bảng liên quan:

- `asset_transactions`
- `asset_lifecycle`
- `asset_transaction_items`
- `warehouse_asset`
- `advisor_requests`

Luồng:

1. Tìm giao dịch cấp phát theo `asset_transactions.code`.
2. Tìm lifecycle theo `transaction_id`.
3. Với từng batch, lấy số lượng đã cấp từ `asset_transaction_items`.
4. Cộng trả lại vào `warehouse_asset` nếu phù hợp.
5. Nếu trạng thái trả về khác, tạo batch mới.
6. Cập nhật `asset_transaction_items.warehouse_asset_id` nếu chuyển sang batch mới.
7. Cập nhật `asset_lifecycle.return_date`.
8. Cập nhật request thu hồi sang đã duyệt nếu đi qua luồng đề nghị.

Điểm dễ lỗi:

- Thu hồi không tạo header mới trong một số luồng; nó cập nhật phiếu cấp phát cũ.
- Vì `allocation_transaction_code` trong request không có FK, cần validate bằng service.
- Khi tài sản trả về hỏng/bảo trì/hết hạn, có thể phát sinh batch mới.

### 9.6. Thanh lý

Bảng liên quan:

- `asset_transactions`
- `asset_lifecycle`
- `asset_transaction_items`
- `warehouse_asset`

Luồng:

1. Tạo header `asset_transactions` với `type = 2`.
2. Tạo `asset_lifecycle` với `disposal_date`.
3. Trừ tồn ở `warehouse_asset`.
4. Ghi dòng `asset_transaction_items`.

Điểm dễ lỗi:

- Thanh lý làm giảm tồn vĩnh viễn.
- Không nên xóa lô/tài sản để biểu diễn thanh lý; phải dùng giao dịch thanh lý.

### 9.7. Bảo trì

Bảng liên quan:

- `warehouse_asset`
- `asset_transactions`
- `asset_maintenances`
- `asset_transaction_items`
- Có thể cập nhật `advisor_requests`.

Luồng:

1. Tạo header `asset_transactions` với `type = 5`.
2. Tạo `asset_maintenances` với trạng thái đang thực hiện.
3. Trừ số lượng bảo trì khỏi tồn khả dụng.
4. Ghi `asset_transaction_items`.
5. Set batch sang trạng thái bảo trì.
6. Khi hoàn thành, cộng lại số lượng và cập nhật trạng thái/ngày bảo trì tiếp theo.
7. Set `asset_maintenances.status = 1`.

Điểm dễ lỗi:

- Có hai trạng thái cần phân biệt: trạng thái phiếu bảo trì và trạng thái lô.
- Tài sản cần bảo trì có thể được suy ra từ `maintenance_due <= now`, không chỉ `status = 3`.
- Hoàn thành bảo trì có thể tạo batch mới nếu trạng thái sau bảo trì khác.

### 9.8. Gửi và xử lý đề nghị cấp phát/thu hồi

Bảng liên quan:

- `users`
- `warehouse_user`
- `majors`
- `classes`
- `students`
- `assets`
- `warehouses`
- `advisor_requests`
- Nhóm giao dịch C khi duyệt.

Luồng gửi:

1. Chỉ huy/cố vấn tạo request.
2. Service kiểm tra user có `major_id`.
3. Service kiểm tra user có kho trong `warehouse_user`.
4. Nếu chọn học viên, kiểm tra học viên thuộc lớp thuộc major của user.
5. Nếu chọn lớp, kiểm tra lớp thuộc major của user.
6. Nếu request có nhiều item, tạo nhiều dòng `advisor_requests`.

Luồng duyệt:

1. Cán bộ kho/admin xem request.
2. Nếu không phải admin, service kiểm tra người xử lý có quyền với `warehouse_id`.
3. Duyệt hoặc từ chối.
4. Nếu duyệt cấp phát, tạo giao dịch cấp phát.
5. Nếu duyệt thu hồi, xử lý thu hồi theo transaction code hoặc nhập kho fallback.

Điểm dễ lỗi:

- Một request nghiệp vụ trên UI có thể là nhiều dòng DB.
- `advisor_requests.status = 1` nghĩa là request đã xử lý, không nhất thiết tự nó mô tả đầy đủ giao dịch tài sản. Cần xem nhóm C.
- Yêu cầu khác `type = 4` có thể không có asset/quantity.

## 10. Các điểm thiết kế cần đặc biệt chú ý

### 10.1. Phân biệt catalog, tồn kho và lịch sử

| Khái niệm | Bảng | Câu hỏi trả lời |
|---|---|---|
| Loại tài sản | `assets` | Hệ thống quản lý loại tài sản gì? |
| Lô tồn thực tế | `warehouse_asset` | Trong kho còn bao nhiêu, thuộc lô nào, tình trạng gì? |
| Lịch sử biến động | `asset_transactions`, `asset_transaction_items` | Tồn kho thay đổi do giao dịch nào? |

Nếu cần số lượng hiện tại, ưu tiên `warehouse_asset.quantity`.

Nếu cần giải thích vì sao số lượng thay đổi, đọc `asset_transaction_items` và `asset_transactions`.

### 10.2. Quan hệ không có FK vật lý

`advisor_requests.allocation_transaction_code -> asset_transactions.code` là quan hệ nghiệp vụ, không có FK vật lý.

Hệ quả:

- DB không tự chặn mã giao dịch sai.
- Khi query cần left join bằng `code` và xử lý trường hợp không tìm thấy.
- Khi tạo/cập nhật request nên validate bằng service.

### 10.3. Xóa vật lý có thể phá lịch sử

Một số FK đang `CASCADE`, ví dụ:

- `warehouse_asset -> asset_transaction_items`.
- `asset_transactions -> asset_transaction_items` và các bảng phụ.
- `users -> advisor_requests` qua `advisor_id`.

Nếu xóa vật lý dữ liệu cha, lịch sử con có thể mất. Với hệ thống kho, nên ưu tiên soft delete hoặc chặn xóa khi đã phát sinh giao dịch.

### 10.4. Trạng thái lô có thể là trạng thái suy luận

Code thống kê/lọc trạng thái có thể dùng:

- `warehouse_asset.status`.
- `warehouse_asset.maintenance_due`.
- `warehouse_asset.expiration_date`.

Do đó:

- Một lô có `status = GOOD` nhưng quá hạn sử dụng vẫn có thể được xem là hết hạn.
- Một lô có `maintenance_due <= now` có thể được xem là cần bảo trì.
- Khi báo cáo, cần dùng cùng logic với service để tránh lệch số.

### 10.5. `students` và `users` là hai miền tài khoản khác nhau

- `users`: admin, cán bộ kho, chỉ huy/cố vấn, người thao tác hệ thống.
- `students`: học viên/sinh viên, phục vụ học vụ và yêu cầu.

Hệ quả:

- `asset_lifecycle.receiver_id` không trỏ tới `students`.
- `advisor_requests.student_id` mới trỏ tới học viên.
- Nếu cần báo cáo "học viên đang được cấp phát gì", cần nối dữ liệu request và giao dịch cẩn thận.

### 10.6. Request không phải transaction

`advisor_requests` là đề nghị. `asset_transactions` mới là giao dịch kho thực tế.

Hệ quả:

- Request chờ duyệt chưa làm thay đổi tồn kho.
- Duyệt/tạo giao dịch mới làm thay đổi `warehouse_asset.quantity`.
- Không nên tính tồn kho từ request.

### 10.7. Bảng địa chỉ hành chính chưa nối với địa chỉ kho

Hiện tại:

- `warehouses.address_id -> address.id`.
- `address` chỉ có text và tọa độ.
- `provinces`, `wards`, `administrative_units` là danh mục riêng.

Nếu muốn chọn tỉnh/xã chuẩn cho kho, cần bổ sung FK từ `address` sang `provinces`/`wards`.

## 11. Bảng tra nhanh theo tên bảng

| Bảng | Nhóm | Nhiệm vụ ngắn |
|---|---|---|
| `users` | A | Tài khoản nội bộ và người thao tác hệ thống. |
| `roles` | A | Vai trò người dùng. |
| `permissions` | A | Quyền thao tác chi tiết. |
| `role_permission` | A | Bảng nối vai trò-quyền. |
| `categories` | B | Nhóm/danh mục tài sản. |
| `assets` | B | Catalog loại tài sản. |
| `address` | B/E | Địa chỉ chi tiết của kho. |
| `warehouses` | B | Kho quản lý tồn. |
| `warehouse_user` | B | Phân công user quản lý kho. |
| `warehouse_asset` | B | Tồn kho thực tế theo lô. |
| `asset_transactions` | C | Header phiếu giao dịch. |
| `asset_imports` | C | Thông tin riêng của phiếu nhập. |
| `asset_exports` | C | Thông tin riêng của phiếu xuất. |
| `asset_transaction_items` | C | Dòng tài sản/lô trong phiếu. |
| `asset_lifecycle` | C | Cấp phát, thu hồi, thanh lý. |
| `asset_maintenances` | C | Thông tin phiếu bảo trì. |
| `majors` | D | Hệ/ngành quản lý học vụ. |
| `classes` | D | Lớp thuộc hệ/ngành. |
| `students` | D | Học viên/sinh viên. |
| `advisor_requests` | D | Đề nghị cấp phát/thu hồi/yêu cầu khác. |
| `administrative_units` | E | Loại đơn vị hành chính. |
| `provinces` | E | Tỉnh/thành phố. |
| `wards` | E | Phường/xã. |
| `log_actions` | F | Danh mục hành động log. |
| `log_controllers` | F | Danh mục phân hệ log. |
| `kqn_logs` | F | Nhật ký thao tác thực tế. |

## 12. Cách đọc DB khi debug một vấn đề

### 12.1. Muốn biết một tài sản còn bao nhiêu trong kho

Đọc:

1. `assets` để tìm `asset_id`.
2. `warehouse_asset` theo `asset_id`, `warehouse_id`.
3. Cộng `quantity` theo trạng thái/lô nếu cần.

Không đọc `asset_transactions` để tính số hiện tại trừ khi đang đối soát lịch sử.

### 12.2. Muốn biết vì sao tồn kho bị giảm

Đọc:

1. `warehouse_asset` để biết lô.
2. `asset_transaction_items` theo `warehouse_asset_id`.
3. `asset_transactions` theo `transaction_id`.
4. Dựa vào `type` đọc thêm bảng phụ.

### 12.3. Muốn biết tài sản nào đang cấp phát chưa thu hồi

Đọc:

1. `asset_lifecycle` với `return_date IS NULL`.
2. Join `asset_transactions` để lấy kho, mã phiếu.
3. Join `asset_transaction_items`.
4. Join `warehouse_asset` và `assets`.

### 12.4. Muốn biết yêu cầu của chỉ huy đã xử lý chưa

Đọc:

1. `advisor_requests` theo `advisor_id`, `status`, `type`.
2. Join `classes`, `students`, `assets`, `users` để hiển thị.
3. Nếu cần giao dịch thật, dùng `allocation_transaction_code` hoặc logic xử lý để tìm `asset_transactions`.

### 12.5. Muốn biết user có được xử lý kho này không

Đọc:

1. `users` để biết user/role.
2. Nếu không phải admin, đọc `warehouse_user` theo `user_id`.
3. Kiểm tra `warehouse_id` của dữ liệu nghiệp vụ có nằm trong danh sách kho được gán không.

## 13. Gợi ý cải thiện tài liệu/schema sau này

Các điểm này không bắt buộc sửa ngay, nhưng nên ghi nhớ khi phát triển tiếp:

- Cân nhắc thêm FK vật lý hoặc bảng liên kết rõ ràng giữa `advisor_requests` và `asset_transactions` thay vì chỉ dùng `allocation_transaction_code`.
- Cân nhắc chuẩn hóa địa chỉ kho bằng `province_code`, `ward_code` nếu UI cần chọn địa giới hành chính.
- Cân nhắc hạn chế xóa vật lý các bảng đã có lịch sử giao dịch, đặc biệt `warehouse_asset`, `asset_transactions`, `users`.
- Cân nhắc nhất quán tên bảng: `role_permission` đang số ít, các bảng khác nhiều chỗ dùng số nhiều.
- Cân nhắc tài liệu hóa rõ role id seed, vì code hiện có chỗ kiểm tra role bằng số.
- Cân nhắc thêm view/report phục vụ đối soát tồn kho: tồn hiện tại từ `warehouse_asset` so với tổng biến động trong `asset_transaction_items`.
