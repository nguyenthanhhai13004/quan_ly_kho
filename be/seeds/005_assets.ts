import { Knex } from "knex";
import { ASSET_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

const ASSETS_DEFAULT = [
  {
    id: 1,
    name: "Súng trường CKC",
    code: "VK-CKC-001",
    image_url: "https://example.com/images/vukhi_ckc.jpg",
    cost: 5000000,
    category_id: 1,
    status: 1,
  },
  {
    id: 2,
    name: "Súng tiểu liên AK-47",
    code: "VK-AK47-002",
    image_url: "https://example.com/images/vukhi_ak47.jpg",
    cost: 8000000,
    category_id: 1,
    status: 1,
  },

  {
    id: 3,
    name: "Xe tải ZIL-130",
    code: "PT-ZIL130-001",
    image_url: "https://example.com/images/pt_zil130.jpg",
    cost: 350000000,
    category_id: 2,
    status: 1,
  },
  {
    id: 4,
    name: "Xe jeep UAZ-469",
    code: "PT-UAZ469-002",
    image_url: "https://example.com/images/pt_uaz469.jpg",
    cost: 280000000,
    category_id: 2,
    status: 1,
  },

  {
    id: 5,
    name: "Máy tính để bàn Dell OptiPlex",
    code: "CNTT-DOPT-001",
    image_url: "https://example.com/images/cntt_dell.jpg",
    cost: 15000000,
    category_id: 3,
    status: 1,
  },
  {
    id: 6,
    name: "Máy in Canon LBP2900",
    code: "CNTT-MLBP-002",
    image_url: "https://example.com/images/cntt_canon.jpg",
    cost: 3500000,
    category_id: 3,
    status: 1,
  },

  {
    id: 7,
    name: "Bộ quân phục dã chiến",
    code: "DP-DC-001",
    image_url: "https://example.com/images/dp_dachien.jpg",
    cost: 600000,
    category_id: 4,
    status: 1,
  },
  {
    id: 8,
    name: "Giày quân đội cao cổ",
    code: "DP-GCC-002",
    image_url: "https://example.com/images/dp_giay.jpg",
    cost: 400000,
    category_id: 4,
    status: 1,
  },

  {
    id: 9,
    name: "Pin AA 1.5V",
    code: "VT-AA15-001",
    image_url: "https://example.com/images/vt_pin.jpg",
    cost: 10000,
    category_id: 5,
    status: 1,
  },
  {
    id: 10,
    name: "Giấy in A4 80gsm",
    code: "VT-A480-002",
    image_url: "https://example.com/images/vt_giay.jpg",
    cost: 80000,
    category_id: 5,
    status: 1,
  },
  {
    id: 11,
    name: "Súng ngắn K54",
    code: "VK-K54-003",
    image_url: "https://example.com/images/vukhi_k54.jpg",
    cost: 7000000,
    category_id: 1,
    status: 1,
  },
  {
    id: 12,
    name: "Dao găm chiến đấu",
    code: "VK-DG-004",
    image_url: "https://example.com/images/vukhi_daogam.jpg",
    cost: 500000,
    category_id: 1,
    status: 1,
  },

  // === Phương tiện ===
  {
    id: 13,
    name: "Xe tải KamAZ 43118",
    code: "PT-KAMAZ-003",
    image_url: "https://example.com/images/pt_kamaz.jpg",
    cost: 1200000000,
    category_id: 2,
    status: 1,
  },
  {
    id: 14,
    name: "Xe cứu thương quân y",
    code: "PT-AMB-004",
    image_url: "https://example.com/images/pt_ambulance.jpg",
    cost: 950000000,
    category_id: 2,
    status: 1,
  },

  // === Thiết bị CNTT ===
  {
    id: 15,
    name: "Switch mạng Cisco 24 cổng",
    code: "CNTT-SW24-003",
    image_url: "https://example.com/images/cntt_switch.jpg",
    cost: 8500000,
    category_id: 3,
    status: 1,
  },
  {
    id: 16,
    name: "Máy chiếu Epson EB-X06",
    code: "CNTT-MC-004",
    image_url: "https://example.com/images/cntt_maychieu.jpg",
    cost: 12000000,
    category_id: 3,
    status: 1,
  },

  // === Đồng phục ===
  {
    id: 17,
    name: "Mũ cối quân đội",
    code: "DP-MC-003",
    image_url: "https://example.com/images/dp_mucoi.jpg",
    cost: 150000,
    category_id: 4,
    status: 1,
  },
  {
    id: 18,
    name: "Áo khoác quân phục mùa đông",
    code: "DP-AKMD-004",
    image_url: "https://example.com/images/dp_aokhoac.jpg",
    cost: 800000,
    category_id: 4,
    status: 1,
  },

  // === Vật tư tiêu hao ===
  {
    id: 19,
    name: "Mực in LaserJet HP 12A",
    code: "VT-MUC12A-003",
    image_url: "https://example.com/images/vt_mucin.jpg",
    cost: 250000,
    category_id: 5,
    status: 1,
  },
  {
    id: 20,
    name: "Nhiên liệu Diesel B2",
    code: "VT-DIESEL-004",
    image_url: "https://example.com/images/vt_diesel.jpg",
    cost: 23000,
    category_id: 5,
    status: 1,
  }
];
export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex(ASSET_TABLE_NAME).del();

    // Inserts seed entries
    await knex(ASSET_TABLE_NAME).insert(ASSETS_DEFAULT);
};
