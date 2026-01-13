import { Knex } from "knex";
import { ASSET_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

export const ASSETS_DEFAULT = [
  // === Điện tử - Điện lạnh ===
  { id: 1, name: "Tủ lạnh LG GR-B247JDS", code: "DTDL-0001", image_url: "/assets/tula-dich-lg.jpg", cost: 12000000, category_id: 1, description: "Tủ lạnh LG 587L, inverter tiết kiệm điện." },
  { id: 2, name: "Máy giặt Samsung WA16J6800CS", code: "DTDL-0002", image_url: "/assets/may-giat-samsung.jpg", cost: 8500000, category_id: 1, description: "Máy giặt Samsung 16kg, giặt sạch hiệu quả." },
  { id: 3, name: "Điều hòa Daikin FTKA50TMVMV", code: "DTDL-0003", image_url: "/assets/dieu-hoa-daikin.jpg", cost: 18000000, category_id: 1, description: "Điều hòa Daikin 2 HP, làm lạnh nhanh." },
  { id: 4, name: "Tivi Samsung 55 inch QN55Q80A", code: "DTDL-0004", image_url: "/assets/tivi-samsung.jpg", cost: 25000000, category_id: 1, description: "Tivi QLED Samsung 55 inch, hình ảnh sắc nét." },
  { id: 5, name: "Lò vi sóng Electrolux EME3075X", code: "DTDL-0005", image_url: "/assets/lo-vi-song.jpg", cost: 4500000, category_id: 1, description: "Lò vi sóng 30L, có chế độ tiệt trùng." },

  // === Nội thất ===
  { id: 6, name: "Bàn công ty gỗ 1.6m", code: "NT-0001", image_url: "/assets/ban-cong-ty.jpg", cost: 3500000, category_id: 2, description: "Bàn làm việc gỗ MFC 1.6m, thiết kế hiện đại." },
  { id: 7, name: "Ghế xoay văn phòng Nowy", code: "NT-0002", image_url: "/assets/ghe-xoay.jpg", cost: 2000000, category_id: 2, description: "Ghế xoay ergonomic, tựa lưng cao." },
  { id: 8, name: "Tủ gỗ 4 ngăn", code: "NT-0003", image_url: "/assets/tu-go.jpg", cost: 4200000, category_id: 2, description: "Tủ tài liệu gỗ 4 ngăn, bền và đẹp." },
  { id: 9, name: "Kệ sắt 5 tầng", code: "NT-0004", image_url: "/assets/ke-sat.jpg", cost: 1800000, category_id: 2, description: "Kệ lưu trữ sắt không gỉ 5 tầng." },

  // === Công cụ và Máy móc ===
  { id: 10, name: "Máy khoan Bosch GSB 3600 RE", code: "CCMM-0001", image_url: "/assets/may-khoan-bosch.jpg", cost: 2800000, category_id: 3, description: "Máy khoan vỏ sắt Bosch, công suất 600W." },
  { id: 11, name: "Máy mài góc Makita 9555K", code: "CCMM-0002", image_url: "/assets/may-mai-goc.jpg", cost: 1950000, category_id: 3, description: "Máy mài góc 125mm, tốc độ cao." },
  { id: 12, name: "Máy cắt cỏ Toro 20594", code: "CCMM-0003", image_url: "/assets/may-cat-co.jpg", cost: 12500000, category_id: 3, description: "Máy cắt cỏ xăng Toro, công suất lớn." },
  { id: 13, name: "Bộ tua vít 100 cái Dewalt", code: "CCMM-0004", image_url: "/assets/bo-tua-vit.jpg", cost: 950000, category_id: 3, description: "Bộ tua vít đa năng 100 chi tiết." },

  // === Vật liệu xây dựng ===
  { id: 14, name: "Xi măng Portland PCB40", code: "VLXD-0001", image_url: "/assets/xi-mang.jpg", cost: 150000, category_id: 4, description: "Xi măng Portland túi 50kg, chất lượng cao." },
  { id: 15, name: "Cát xây dựng 1 khối", code: "VLXD-0002", image_url: "/assets/cat-xay-dung.jpg", cost: 350000, category_id: 4, description: "Cát xây dựng, hạt cân đối, sạch." },
  { id: 16, name: "Gạch bê tông 4x20x40cm", code: "VLXD-0003", image_url: "/assets/gach-be-tong.jpg", cost: 7500, category_id: 4, description: "Gạch bê tông tiêu chuẩn xây dựng." },
  { id: 17, name: "Thép xây dựng Φ10 mm", code: "VLXD-0004", image_url: "/assets/thep-xay-dung.jpg", cost: 13000, category_id: 4, description: "Thép xây dựng cây dài, chất lượng cao." },

  // === Hàng tiêu dùng ===
  { id: 18, name: "Giấy vệ sinh Pulppy 10 cuộn", code: "HTD-0001", image_url: "/assets/giay-ve-sinh.jpg", cost: 180000, category_id: 5, description: "Giấy vệ sinh 3 lớp mềm mại, an toàn." },
  { id: 19, name: "Nước lọc Aquafina 1.5L", code: "HTD-0002", image_url: "/assets/nuoc-loc.jpg", cost: 15000, category_id: 5, description: "Nước lọc tinh khiết, an toàn uống." },
  { id: 20, name: "Cà phê Trung Nguyên 500g", code: "HTD-0003", image_url: "/assets/ca-phe.jpg", cost: 125000, category_id: 5, description: "Cà phê Trung Nguyên Sáng Tạo, hương thơm đặc trưng." },
  { id: 21, name: "Dầu ăn Tường An 1L", code: "HTD-0004", image_url: "/assets/dau-an.jpg", cost: 48000, category_id: 5, description: "Dầu ăn Tường An, nguyên chất, không chiên dầu." },

  // === Văn phòng phẩm ===
  { id: 22, name: "Giấy in A4 80gsm Giang", code: "VPP-0001", image_url: "/assets/giay-a4.jpg", cost: 95000, category_id: 6, description: "Giấy in trắng 80gsm, 500 tờ/ream." },
  { id: 23, name: "Bút bi Thiên Long TL-088", code: "VPP-0002", image_url: "/assets/but-bi.jpg", cost: 5000, category_id: 6, description: "Bút bi mực xanh, viết mượt, bền bỉ." },
  { id: 24, name: "Vở kẻ ngang 200 trang NB", code: "VPP-0003", image_url: "/assets/vo.jpg", cost: 22000, category_id: 6, description: "Vở ghi chú 200 trang, giấy trắng sáng." },
  { id: 25, name: "Keo dán Comix 30ml", code: "VPP-0004", image_url: "/assets/keo-dan.jpg", cost: 8500, category_id: 6, description: "Keo dán tay 30ml, khô nhanh, dính chắc." },

  // === Dụng cụ nhà bếp ===
  { id: 26, name: "Bộ nồi 3 cái Happycook", code: "DCNB-0001", image_url: "/assets/bo-noi.jpg", cost: 950000, category_id: 7, description: "Bộ nồi 3 cái đáy từ, nắp kính." },
  { id: 27, name: "Chảo chống dính Fissler", code: "DCNB-0002", image_url: "/assets/chao-chong-dinh.jpg", cost: 1200000, category_id: 7, description: "Chảo 28cm, lớp chống dính cao cấp." },
  { id: 28, name: "Bộ dao 5 cái Suncraft", code: "DCNB-0003", image_url: "/assets/bo-dao.jpg", cost: 480000, category_id: 7, description: "Bộ dao nhà bếp Nhật Bản, lưỡi sắc." },
  { id: 29, name: "Máy xay sinh tố Philips", code: "DCNB-0004", image_url: "/assets/may-xay-sinh-to.jpg", cost: 3500000, category_id: 7, description: "Máy xay sinh tố 600W, cung cấp năng lượng." },

  // === Quần áo và Giày dép ===
  { id: 30, name: "Áo sơ mi nam Việt Tiến", code: "QAGD-0001", image_url: "/assets/ao-so-mi.jpg", cost: 250000, category_id: 8, description: "Áo sơ mi công sở 100% cotton, thoáng khí." },
  { id: 31, name: "Quần tây nam Donk", code: "QAGD-0002", image_url: "/assets/quan-tay.jpg", cost: 380000, category_id: 8, description: "Quần tây nam chất vải cao cấp." },
  { id: 32, name: "Giày da nam Bitis", code: "QAGD-0003", image_url: "/assets/giay-nam.jpg", cost: 650000, category_id: 8, description: "Giày da tự nhiên, thoáng khí, bền bỉ." },
  { id: 33, name: "Tất nam cao cổ Sạch", code: "QAGD-0004", image_url: "/assets/tat-nam.jpg", cost: 15000, category_id: 8, description: "Tất nam cotton, giữ ấm tốt." },
];
export const ASSETS_DEFAULT_NO_COST = ASSETS_DEFAULT.map(({ cost, ...rest }) => rest);

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex(ASSET_TABLE_NAME).del();

    // Inserts seed entries
    await knex(ASSET_TABLE_NAME).insert(ASSETS_DEFAULT_NO_COST);
};
