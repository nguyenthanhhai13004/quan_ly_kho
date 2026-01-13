export const mockTransactionDetails = {
  1: {
    id: 1,
    type: "import",
    order_name: "Nhập kho vũ khí đợt 1",
    date: "2025-03-12",
    reason: "Bổ sung vũ khí cho kho trung tâm",
    note: "Kiểm tra kỹ lưỡng trước khi nhập kho",
    receiver: {
      name: "Kho trung tâm",
      phone: "0987654321",
      address: "Số 123, Phố Láng, Hà Nội"
    },
    assets: [
      { asset_code: "TS001", asset_name: "Súng tiểu liên AK-47", quantity: 50 },
      { asset_code: "TS002", asset_name: "Đạn 7.62mm", quantity: 5000 },
    ],
  },
  2: {
    id: 2,
    type: "export",
    order_name: "Xuất kho thiết bị hành chính",
    date: "2025-04-15",
    reason: "Cấp cho phòng hành chính Bộ Tư lệnh",
    note: "Xuất theo đúng danh sách và số lượng",
    receiver: {
      name: "Phòng hành chính",
      phone: "0912345678",
      address: "Số 45, Quận Hoàn Kiếm, Hà Nội"
    },
    assets: [
      { asset_code: "TS008", asset_name: "Laptop Dell Latitude", quantity: 5 },
      { asset_code: "TS007", asset_name: "Máy in HP LaserJet Pro", quantity: 1 },
    ],
  },
};
