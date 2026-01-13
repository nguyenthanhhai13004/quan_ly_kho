import { Knex } from "knex";
import { CATEGORY_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

const CATEGORIES_DEFAULT = [
  {
    id:1,
    name: "Điện tử - Điện lạnh",
    description: "Các sản phẩm điện tử như tivi, tủ lạnh, máy giặt, điều hòa và các thiết bị điện khác.",
    color: "#DC2626",
    code:"DT-DL"
  },
  {
    id:2,
    name: "Nội thất",
    description: "Bàn, ghế, tủ, giường, kệ và các đồ nội thất văn phòng, gia đình.",
    color: "#2563EB",
    code:"NT"
  },
  {
    id:3,
    name: "Công cụ và Máy móc",
    description: "Máy khoan, máy cắt, máy hàn, khoan cầm tay và các công cụ xây dựng, sản xuất.",
    color: "#16A34A",
    code:"CCMM"
  },
  {
    id:4,
    name: "Vật liệu xây dựng",
    description: "Xi măng, cát, gạch, thép, kính, sơn và các vật liệu xây dựng khác.",
    color: "#F59E0B",
    code:"VLXD"
  },
  {
    id:5,
    name: "Hàng tiêu dùng",
    description: "Thực phẩm, đồ uống, giấy vệ sinh, hàng dùng hàng ngày và các vật phẩm tiêu dùng.",
    color: "#6B7280",
    code:"HTD"
  },
  {
    id:6,
    name: "Văn phòng phẩm",
    description: "Giấy in, bút, vở, tập, keo, kéo, ghim và các đồ dùng văn phòng khác.",
    color: "#8B5CF6",
    code:"VPP"
  },
  {
    id:7,
    name: "Dụng cụ nhà bếp",
    description: "Nồi, chảo, dao, thìa, xoong, vung và các dụng cụ nấu ăn, ăn uống.",
    color: "#EC4899",
    code:"DCNB"
  },
  {
    id:8,
    name: "Quần áo và Giày dép",
    description: "Áo, quần, áo khoác, giày, dép, tất và các mặt hàng may mặc.",
    color: "#F97316",
    code:"QAGD"
  },
  {
    id:9,
    name: "Đồ chơi và Giải trí",
    description: "Trò chơi, đồ chơi trẻ em, sách, tranh, đất sét và các vật dụng giải trí.",
    color: "#06B6D4",
    code:"DCGT"
  },
  {
    id:10,
    name: "Dụng cụ vệ sinh",
    description: "Chổi, chùi, xô, chất tẩy rửa, xà phòng và các đồ vệ sinh nhà cửa.",
    color: "#10B981",
    code:"DCVS"
  },
  {
    id:11,
    name: "Hệ thống an ninh",
    description: "Camera giám sát, khóa cửa, báo động, đèn cảnh báo và thiết bị an ninh.",
    color: "#EF4444",
    code:"HTAN"
  },
  {
    id:12,
    name: "Thiết bị chiếu sáng",
    description: "Đèn LED, đèn huỳnh quang, đèn bàn, đèn trần và các loại bóng đèn.",
    color: "#FBBF24",
    code:"TBCS"
  },
  {
    id:13,
    name: "Ống và Phụ kiện ống",
    description: "Ống PVC, ống kim loại, khớp nối, van, nước và phụ kiện hệ thống ống.",
    color: "#6366F1",
    code:"OPK"
  },
  {
    id:14,
    name: "Thiết bị phòng cháy chữa cháy",
    description: "Bình cứu hỏa, mặt nạ, áo chống cháy, gậy phá cửa và thiết bị PCCC.",
    color: "#D32F2F",
    code:"TBPCCC"
  },
  {
    id:15,
    name: "Sắt thép và Hình thép",
    description: "Sắt ống, sắt hộp, góc thép, tấm thép, thanh sắt và các sản phẩm sắt thép.",
    color: "#455A64",
    code:"STHT"
  },
  {
    id:16,
    name: "Hóa chất và Dung dịch",
    description: "Hóa chất tẩy rửa, dầu, mỡ, dung dịch làm mát và các chất hóa học công nghiệp.",
    color: "#7C3AED",
    code:"HCDD"
  },
  {
    id:17,
    name: "Dây điện và Cáp",
    description: "Dây xanh đỏ, dây nối đất, cáp thông tin, cáp quang và các loại dây cáp.",
    color: "#F59E0B",
    code:"DDC"
  },
  {
    id:18,
    name: "Thiết bị đo lường",
    description: "Thước, cân, bộ đo áp suất, máy đo độ ẩm, dụng cụ đo lường chuyên dụng.",
    color: "#14B8A6",
    code:"TBDL"
  },
  {
    id:19,
    name: "Phụ tùng xe máy",
    description: "Piston, xích, bánh răng, ma sát, bộ ly hợp và các phụ tùng xe máy.",
    color: "#EA580C",
    code:"PTXM"
  },
  {
    id:20,
    name: "Trang trí và Quà tặng",
    description: "Khung ảnh, gương, tranh, đèn trang trí, gối tựa và vật dụng trang trí nhà.",
    color: "#DB2777",
    code:"TTTG"
  },
  {
    id:21,
    name: "Thiết bị thể thao",
    description: "Quần áo thể thao, giày chạy bộ, dumbbells, thảm yoga, dụng cụ gym.",
    color: "#059669",
    code:"TBTT"
  },
  {
    id:22,
    name: "Chăm sóc cá nhân",
    description: "Dầu gội, sữa tắm, kem đánh răng, khăn tắm, sáp và các sản phẩm chăm sóc.",
    color: "#BE185D",
    code:"CSCN"
  },
  {
    id:23,
    name: "Thiết bị giải trí âm thanh",
    description: "Loa, tai nghe, micro, amply, DVD và các thiết bị âm thanh, video.",
    color: "#5B21B6",
    code:"TBGTAM"
  },
  {
    id:24,
    name: "Thiết bị y tế",
    description: "Nhiệt kế, máy đo huyết áp, băng cước, nước muối sinh lý và dụng cụ y tế.",
    color: "#DC2626",
    code:"TBYT"
  },
  {
    id:25,
    name: "Xơ cứng quần áo",
    description: "Là ủi, nước xả vải, bột giặt, nước giặt và các sản phẩm chăm sóc quần áo.",
    color: "#4F46E5",
    code:"XCQA"
  }
];
export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex(CATEGORY_TABLE_NAME).del();

    // Inserts seed entries
    await knex(CATEGORY_TABLE_NAME).insert(CATEGORIES_DEFAULT);
};
