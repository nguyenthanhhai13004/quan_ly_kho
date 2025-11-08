import { CiSettings } from "react-icons/ci";
import CustomButton from "../../components/common/custom-button";
import CustomTable from "../../components/common/custom-table";
import CustomBadge, { type CustomBadgeProps } from "../../components/common/custom-badge";
import { BiEdit, BiTrash } from "react-icons/bi";
import { FaFileExcel } from "react-icons/fa";
import CustomIcon from "../../components/common/custom-icon";
import WarehouseFilter from "./warehouse-filter";

const columns = [
  "STT",
  "Mã giao dịch",
  "Loại",
  "Tài sản",
  "Số lượng",
  "Người thực hiện",
  "Ngày giờ",
  "Ghi chú",
  "Hoạt động"
];

const transactionHistory = [
  {
    id: 1,
    activity: "Nhập kho",
    transaction_code: "GD0001",
    type: { code: "GD001", name: "Nhập" },
    asset: { code: "TS001", name: "Súng tiểu liên AK-47" },
    quantity: 50,
    performed_by: "Nguyễn Văn A",
    datetime: "2025-03-12 08:45",
    note: "Nhập đợt 1 từ kho trung tâm."
  },
  {
    id: 2,
    activity: "Cấp phát tài sản",
    transaction_code: "GD0002",
    type: { code: "GD003", name: "Cấp phát" },
    asset: { code: "TS004", name: "Xe tải quân sự Ural-4320" },
    quantity: 2,
    performed_by: "Trần Thị B",
    datetime: "2025-04-05 14:20",
    note: "Cấp cho đơn vị vận tải số 2."
  },
  {
    id: 3,
    activity: "Xuất kho",
    transaction_code: "GD0003",
    type: { code: "GD002", name: "Xuất" },
    asset: { code: "TS008", name: "Máy tính xách tay Dell Latitude" },
    quantity: 5,
    performed_by: "Lê Minh C",
    datetime: "2025-04-15 09:10",
    note: "Xuất phục vụ công tác hành chính tại Bộ Tư lệnh."
  },
  {
    id: 4,
    activity: "Thu hồi tài sản",
    transaction_code: "GD0004",
    type: { code: "GD004", name: "Thu hồi" },
    asset: { code: "TS011", name: "Giày dã chiến cao cổ" },
    quantity: 20,
    performed_by: "Phạm Văn D",
    datetime: "2025-05-02 16:35",
    note: "Thu hồi từ đơn vị huấn luyện sau kỳ thao trường."
  },
  {
    id: 5,
    activity: "Thanh lý",
    transaction_code: "GD0005",
    type: { code: "GD005", name: "Thanh lý" },
    asset: { code: "TS006", name: "Xe jeep chỉ huy UAZ-469" },
    quantity: 1,
    performed_by: "Nguyễn Hữu E",
    datetime: "2025-06-20 10:00",
    note: "Xe hư hỏng nặng, không còn sử dụng được."
  },
  {
    id: 6,
    activity: "Nhập bổ sung",
    transaction_code: "GD0006",
    type: { code: "GD001", name: "Nhập" },
    asset: { code: "TS010", name: "Bộ quân phục mùa hè" },
    quantity: 150,
    performed_by: "Trần Thị B",
    datetime: "2025-07-10 11:30",
    note: "Nhập bổ sung phục vụ đợt huấn luyện mùa hè."
  },
  {
    id: 7,
    activity: "Cấp phát thiết bị",
    transaction_code: "GD0007",
    type: { code: "GD003", name: "Cấp phát" },
    asset: { code: "TS007", name: "Máy in HP LaserJet Pro" },
    quantity: 2,
    performed_by: "Ngô Đức F",
    datetime: "2025-08-05 13:15",
    note: "Cấp cho phòng hành chính."
  },
  {
    id: 8,
    activity: "Xuất vật tư",
    transaction_code: "GD0008",
    type: { code: "GD002", name: "Xuất" },
    asset: { code: "TS013", name: "Pin tiểu AA 1.5V" },
    quantity: 200,
    performed_by: "Vũ Thị G",
    datetime: "2025-09-10 09:50",
    note: "Xuất cho đơn vị kỹ thuật bảo trì thiết bị liên lạc."
  },
  {
    id: 9,
    activity: "Thu hồi thiết bị",
    transaction_code: "GD0009",
    type: { code: "GD004", name: "Thu hồi" },
    asset: { code: "TS009", name: "Thiết bị phát sóng Wi-Fi doanh trại" },
    quantity: 1,
    performed_by: "Đỗ Văn H",
    datetime: "2025-09-20 15:40",
    note: "Thu hồi để bảo trì, nâng cấp firmware."
  },
  {
    id: 10,
    activity: "Thanh lý vật tư cũ",
    transaction_code: "GD0010",
    type: { code: "GD005", name: "Thanh lý" },
    asset: { code: "TS015", name: "Mực in HP 12A" },
    quantity: 10,
    performed_by: "Nguyễn Văn A",
    datetime: "2025-10-02 10:25",
    note: "Thanh lý lô mực in hết hạn sử dụng."
  }
];



export default function WarehouseTable() {
  return (
    <CustomTable
      title="D/S"
      filter={<WarehouseFilter/>}
      columns={columns}
      data={ transactionHistory.map((t, index: number) => [
          index + 1,
          t.transaction_code,
          t.type.name,
          t.asset.name,
          t.quantity,
          <h5 className="text-[#2b7dbc]">{t.performed_by}</h5>,
          t.datetime,
          <p className="text-gray-500">{t.note}</p>,
          <CustomIcon icon={<FaFileExcel size={20} />} label="Xuất Excel"/>
        ])}
    />
  );
}
