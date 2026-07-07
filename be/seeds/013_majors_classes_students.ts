import { Knex } from "knex";
import {
  MAJORS_TABLE_NAME,
  CLASSES_TABLE_NAME,
  STUDENTS_TABLE_NAME,
} from "../src/v1/cores/constants/table-name.constant";
import { hashPassword } from "../src/v1/auths/utils";

export const majors = [
  {
    id: 1,
    name: "Hệ Trinh sát",
    code: "TS",
    description: "Đào tạo lực lượng trinh sát, nắm tình hình và bảo đảm thông tin chiến trường.",
  },
  {
    id: 2,
    name: "Hệ Hậu cần",
    code: "HC",
    description: "Đào tạo lực lượng bảo đảm hậu cần, quân nhu và đời sống bộ đội.",
  },
  {
    id: 3,
    name: "Hệ 1",
    code: "H1",
    description: "Hệ đào tạo sĩ quan chỉ huy cấp phân đội.",
  },
  {
    id: 4,
    name: "Hệ 2",
    code: "H2",
    description: "Hệ đào tạo nghiệp vụ tham mưu và quản lý đơn vị.",
  },
  {
    id: 5,
    name: "Hệ 3",
    code: "H3",
    description: "Hệ đào tạo chuyên môn quân sự cơ sở.",
  },
  {
    id: 6,
    name: "Hệ 4",
    code: "H4",
    description: "Hệ đào tạo bổ túc cán bộ và chuyển loại chuyên ngành.",
  },
  {
    id: 7,
    name: "Hệ 5",
    code: "H5",
    description: "Hệ đào tạo tổng hợp, dùng cho dữ liệu demo nhiều lớp và nhiều học viên.",
  },
  {
    id: 8,
    name: "Hệ 6",
    code: "H6",
    description: "Hệ đào tạo ngắn hạn theo nhiệm vụ của đơn vị.",
  },
  {
    id: 9,
    name: "Hệ 7",
    code: "H7",
    description: "Hệ đào tạo dự bị và bồi dưỡng năng lực quân sự.",
  },
  {
    id: 10,
    name: "Hệ Phòng hóa",
    code: "PH",
    description: "Đào tạo lực lượng phòng hóa, xử lý độc xạ và bảo đảm an toàn hóa học.",
  },
  {
    id: 11,
    name: "Hệ Pháo binh",
    code: "PB",
    description: "Đào tạo lực lượng pháo binh và bảo đảm hỏa lực chi viện.",
  },
  {
    id: 12,
    name: "Hệ Bộ binh",
    code: "BB",
    description: "Đào tạo lực lượng bộ binh, tác chiến mặt đất và quản lý phân đội.",
  },
];

export const classes = [
  {
    id: 1,
    major_id: 1,
    name: "Trinh sát K48",
    code: "TS-K48",
    description: "Khóa 48 - Hệ Trinh sát",
  },
  {
    id: 2,
    major_id: 1,
    name: "Trinh sát K49",
    code: "TS-K49",
    description: "Khóa 49 - Hệ Trinh sát",
  },
  {
    id: 3,
    major_id: 2,
    name: "Hậu cần K48",
    code: "HC-K48",
    description: "Khóa 48 - Hệ Hậu cần",
  },
  {
    id: 4,
    major_id: 2,
    name: "Hậu cần K49",
    code: "HC-K49",
    description: "Khóa 49 - Hệ Hậu cần",
  },
  {
    id: 5,
    major_id: 3,
    name: "Hệ 1 K48",
    code: "H1-K48",
    description: "Khóa 48 - Hệ 1",
  },
  {
    id: 6,
    major_id: 4,
    name: "Hệ 2 K48",
    code: "H2-K48",
    description: "Khóa 48 - Hệ 2",
  },
  {
    id: 7,
    major_id: 7,
    name: "Hệ 5 - Đại đội 1",
    code: "H5-D1",
    description: "Đại đội demo 1 - Hệ 5",
  },
  {
    id: 8,
    major_id: 7,
    name: "Hệ 5 - Đại đội 2",
    code: "H5-D2",
    description: "Đại đội demo 2 - Hệ 5",
  },
  {
    id: 9,
    major_id: 7,
    name: "Hệ 5 - Đại đội 3",
    code: "H5-D3",
    description: "Đại đội demo 3 - Hệ 5",
  },
  {
    id: 10,
    major_id: 7,
    name: "Hệ 5 - Lớp Chỉ huy",
    code: "H5-CH",
    description: "Lớp chỉ huy demo - Hệ 5",
  },
  {
    id: 11,
    major_id: 7,
    name: "Hệ 5 - Lớp Tham mưu",
    code: "H5-TM",
    description: "Lớp tham mưu demo - Hệ 5",
  },
  {
    id: 12,
    major_id: 7,
    name: "Hệ 5 - Lớp Bảo đảm",
    code: "H5-BD",
    description: "Lớp bảo đảm demo - Hệ 5",
  },
  {
    id: 13,
    major_id: 11,
    name: "Pháo binh K48",
    code: "PB-K48",
    description: "Khóa 48 - Hệ Pháo binh",
  },
  {
    id: 14,
    major_id: 12,
    name: "Bộ binh K48",
    code: "BB-K48",
    description: "Khóa 48 - Hệ Bộ binh",
  },
];

export const studentNames = [
  { fullname: "Nguyễn Văn An", class_id: 1 },
  { fullname: "Trần Đức Bình", class_id: 1 },
  { fullname: "Lê Hoàng Cường", class_id: 1 },
  { fullname: "Phạm Minh Đức", class_id: 1 },
  { fullname: "Vũ Thị Phương", class_id: 2 },
  { fullname: "Đặng Quang Huy", class_id: 2 },
  { fullname: "Bùi Thành Long", class_id: 2 },
  { fullname: "Ngô Thanh Sơn", class_id: 2 },

  { fullname: "Đỗ Hữu Tùng", class_id: 3 },
  { fullname: "Lý Văn Khoa", class_id: 3 },
  { fullname: "Mai Xuân Trường", class_id: 3 },
  { fullname: "Phan Đình Quân", class_id: 3 },
  { fullname: "Trịnh Quốc Việt", class_id: 4 },
  { fullname: "Cao Minh Tuấn", class_id: 4 },
  { fullname: "Đinh Thế Anh", class_id: 4 },
  { fullname: "Lương Văn Dũng", class_id: 4 },

  { fullname: "Hà Mạnh Hùng", class_id: 5 },
  { fullname: "Châu Thanh Bảo", class_id: 5 },
  { fullname: "Dương Công Minh", class_id: 5 },
  { fullname: "Tô Văn Thắng", class_id: 6 },
  { fullname: "Kiều Trọng Nghĩa", class_id: 6 },
  { fullname: "Huỳnh Bá Phước", class_id: 6 },

  { fullname: "Nguyễn Khánh Linh", class_id: 7 },
  { fullname: "Trần Minh Nhật", class_id: 7 },
  { fullname: "Lê Bảo Ngọc", class_id: 7 },
  { fullname: "Phạm Gia Hân", class_id: 7 },
  { fullname: "Hoàng Đức Anh", class_id: 8 },
  { fullname: "Vũ Quang Huy", class_id: 8 },
  { fullname: "Đặng Thu Trang", class_id: 8 },
  { fullname: "Bùi Hải Đăng", class_id: 8 },
  { fullname: "Ngô Phương Nam", class_id: 9 },
  { fullname: "Đỗ Minh Châu", class_id: 9 },
  { fullname: "Lý Gia Bảo", class_id: 9 },
  { fullname: "Mai Thanh Tâm", class_id: 9 },
  { fullname: "Phan Quốc Hưng", class_id: 10 },
  { fullname: "Tạ Anh Thư", class_id: 10 },
  { fullname: "Trịnh Hoàng Long", class_id: 10 },
  { fullname: "Cao Nhật Minh", class_id: 10 },
  { fullname: "Đinh Khánh Vy", class_id: 11 },
  { fullname: "Lương Minh Khang", class_id: 11 },
  { fullname: "Hà Tuấn Kiệt", class_id: 11 },
  { fullname: "Châu Ngọc Mai", class_id: 11 },
  { fullname: "Dương Đức Hiếu", class_id: 12 },
  { fullname: "Tô Thanh Lam", class_id: 12 },
  { fullname: "Kiều Bảo Trâm", class_id: 12 },
  { fullname: "Lưu Quang Đạt", class_id: 12 },

  { fullname: "Nguyễn Bá Hưng", class_id: 13 },
  { fullname: "Trần Mạnh Cường", class_id: 13 },
  { fullname: "Lê Đức Hải", class_id: 13 },
  { fullname: "Phạm Quang Vinh", class_id: 13 },
  { fullname: "Hoàng Văn Nam", class_id: 14 },
  { fullname: "Vũ Minh Quân", class_id: 14 },
  { fullname: "Đặng Hữu Phúc", class_id: 14 },
  { fullname: "Bùi Quốc Đạt", class_id: 14 },
];

function normalizeEmailName(fullname: string): string {
  return fullname
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .split(" ")
    .reverse()
    .join("");
}

export async function seed(knex: Knex): Promise<void> {
  await knex.raw("SET FOREIGN_KEY_CHECKS = 0");
  const DEFAULT_PASSWORD = "12345678";
  const DEFAULT_PASSWORD_HASH = await hashPassword(DEFAULT_PASSWORD);

  await knex(STUDENTS_TABLE_NAME).del();
  await knex(CLASSES_TABLE_NAME).del();
  await knex(MAJORS_TABLE_NAME).del();

  await knex(MAJORS_TABLE_NAME).insert(majors);
  await knex(CLASSES_TABLE_NAME).insert(classes);

  const students = studentNames.map((student, index) => {
    const id = index + 1;
    const classObj = classes.find((item) => item.id === student.class_id);
    if (!classObj) {
      throw new Error(`Class ${student.class_id} does not exist in seed data`);
    }

    return {
      id,
      class_id: student.class_id,
      student_code: `${classObj.code}-${String(id).padStart(3, "0")}`,
      fullname: student.fullname,
      email: `${normalizeEmailName(student.fullname)}@hv.quannhu.vn`,
      password: DEFAULT_PASSWORD_HASH,
      phone_number: `09${String(10000000 + id)}`,
      is_active: 1,
    };
  });

  await knex(STUDENTS_TABLE_NAME).insert(students);
  await knex.raw("SET FOREIGN_KEY_CHECKS = 1");
}
