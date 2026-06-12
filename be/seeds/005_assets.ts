import { Knex } from "knex";
import { ASSET_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

export const ASSETS_DEFAULT = [
  // === Vũ khí ===
  { id: 1, name: "Súng trường CKC", code: "VK-0001", image_url: "/assets/ckc.jpg", cost: 5000000, category_id: 1, description: "Súng trường bán tự động CKC, sử dụng đạn 7.62mm." },
  { id: 2, name: "Súng tiểu liên AK-47", code: "VK-0002", image_url: "/assets/ak-47-1.jpg", cost: 8000000, category_id: 1, description: "Súng tiểu liên AK-47, độ bền cao, hoả lực mạnh." },
  { id: 3, name: "Súng ngắn K54", code: "VK-0003", image_url: "/assets/k54.jpg", cost: 7000000, category_id: 1, description: "Súng ngắn K54, sử dụng cho sĩ quan." },
  { id: 4, name: "Dao găm chiến đấu", code: "VK-0004", image_url: "/assets/scaled.jpg", cost: 500000, category_id: 1, description: "Dao găm quân dụng dùng trong cận chiến." },

  // === Phương tiện ===
  { id: 5, name: "Xe tải ZIL-130", code: "PT-0001", image_url: "/assets/zil-130.jpg", cost: 350000000, category_id: 2, description: "Xe tải ZIL-130, chuyên chở hàng hóa quân sự." },
  { id: 6, name: "Xe jeep UAZ-469", code: "PT-0002", image_url: "/assets/uaz-469.jpg", cost: 280000000, category_id: 2, description: "Xe jeep UAZ-469, di chuyển linh hoạt trong nhiều địa hình." },
  { id: 7, name: "Xe tải KamAZ 43118", code: "PT-0003", image_url: "/assets/kamaz.jpg", cost: 1200000000, category_id: 2, description: "Xe tải KamAZ 43118, tải trọng lớn, dùng cho vận tải nặng." },
  { id: 8, name: "Xe cứu thương quân y", code: "PT-0004", image_url: "/assets/cuu-thuong-quan-y.jpg", cost: 950000000, category_id: 2, description: "Xe cứu thương phục vụ công tác quân y." },

  // === CNTT ===
  { id: 9, name: "Máy tính để bàn Dell OptiPlex", code: "CNTT-0001", image_url: "/assets/dell-optiplex.jpg", cost: 15000000, category_id: 3, description: "Máy tính văn phòng Dell OptiPlex hiệu năng ổn định." },
  { id: 10, name: "Máy in Canon LBP2900", code: "CNTT-0002", image_url: "/assets/canon-LBP2900.jpg", cost: 3500000, category_id: 3, description: "Máy in Laser Canon LBP2900, phổ biến trong văn phòng." },
  { id: 11, name: "Switch mạng Cisco 24 cổng", code: "CNTT-0003", image_url: "/assets/43894_cbs110_24t_ha1.jpg", cost: 8500000, category_id: 3, description: "Switch Cisco 24-port dành cho hạ tầng mạng doanh nghiệp." },
  { id: 12, name: "Máy chiếu Epson EB-X06", code: "CNTT-0004", image_url: "/assets/40654_p_54291_epson_eb_x06.jpg", cost: 12000000, category_id: 3, description: "Máy chiếu Epson EB-X06, độ sáng cao, phù hợp giảng dạy." },

  // === Đồng phục ===
  { id: 13, name: "Bộ quân phục dã chiến", code: "DP-0001", image_url: "/assets/SM_DT_10.jpg", cost: 600000, category_id: 4, description: "Bộ quân phục dã chiến tiêu chuẩn." },
  { id: 14, name: "Giày quân đội cao cổ", code: "DP-0002", image_url: "/assets/giay-cao-co.jpg", cost: 400000, category_id: 4, description: "Giày cao cổ bền, phù hợp hành quân." },
  { id: 15, name: "Mũ cối quân đội", code: "DP-0003", image_url: "/assets/mu-coi.jpg", cost: 150000, category_id: 4, description: "Mũ cối đặc trưng của quân đội Việt Nam." },
  { id: 16, name: "Áo khoác quân phục mùa đông", code: "DP-0004", image_url: "/assets/ao-khoac-mua-dong.jpg", cost: 800000, category_id: 4, description: "Áo khoác mùa đông giữ ấm tốt." },

  // === Vật tư tiêu hao ===
  { id: 17, name: "Pin AA 1.5V", code: "VT-0001", image_url: "/assets/50343.jpg", cost: 10000, category_id: 5, description: "Pin AA dùng cho thiết bị cầm tay." },
  { id: 18, name: "Giấy in A4 80gsm", code: "VT-0002", image_url: "/assets/giay_double_a_a4_80_8423cfd51cd243f0970056daa602a143.jpg", cost: 80000, category_id: 5, description: "Giấy in Double A A4 định lượng 80gsm." },
  { id: 19, name: "Mực in LaserJet HP 12A", code: "VT-0003", image_url: "/assets/hp-12a.jpg", cost: 250000, category_id: 5, description: "Hộp mực HP 12A dùng cho máy in LaserJet." },
  { id: 20, name: "Nhiên liệu Diesel B2", code: "VT-0004", image_url: "/assets/28934234.jpg", cost: 23000, category_id: 5, description: "Nhiên liệu Diesel B2 dùng cho xe và thiết bị." },
];
export const ASSETS_DEFAULT_NO_COST = ASSETS_DEFAULT.map(({ cost, ...rest }) => rest);

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex(ASSET_TABLE_NAME).del();

    // Inserts seed entries
    await knex(ASSET_TABLE_NAME).insert(ASSETS_DEFAULT_NO_COST);
};
