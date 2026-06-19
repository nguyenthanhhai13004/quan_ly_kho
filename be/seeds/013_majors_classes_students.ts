import { Knex } from "knex";
import {
  MAJORS_TABLE_NAME,
  CLASSES_TABLE_NAME,
  STUDENTS_TABLE_NAME,
} from "../src/v1/cores/constants/table-name.constant";
import { hashPassword } from "../src/v1/auths/utils";

export async function seed(knex: Knex): Promise<void> {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  const DEFAULT_PASSWORD = "12345678";
  const DEFAULT_PASSWORD_HASH = await hashPassword(DEFAULT_PASSWORD);

  // Clean in reverse order (FK constraints)
  await knex(STUDENTS_TABLE_NAME).del();
  await knex(CLASSES_TABLE_NAME).del();
  await knex(MAJORS_TABLE_NAME).del();

  // ==================== MAJORS ====================
  const majors = [
    {
      id: 1,
      name: "Hậu cần",
      code: "HC",
      description: "Hệ đào tạo Hậu cần quân sự",
    },
    {
      id: 2,
      name: "Quân nhu",
      code: "QN",
      description: "Hệ đào tạo Quân nhu",
    },
    {
      id: 3,
      name: "Xăng dầu",
      code: "XD",
      description: "Hệ đào tạo Xăng dầu quân đội",
    },
    {
      id: 4,
      name: "Vận tải",
      code: "VT",
      description: "Hệ đào tạo Vận tải quân sự",
    },
  ];
  await knex(MAJORS_TABLE_NAME).insert(majors);

  // ==================== CLASSES ====================
  const classes = [
    // Hậu cần
    {
      id: 1,
      major_id: 1,
      name: "Hậu cần K48",
      code: "HC-K48",
      description: "Khóa 48 - Hệ Hậu cần",
    },
    {
      id: 2,
      major_id: 1,
      name: "Hậu cần K49",
      code: "HC-K49",
      description: "Khóa 49 - Hệ Hậu cần",
    },
    // Quân nhu
    {
      id: 3,
      major_id: 2,
      name: "Quân nhu K48",
      code: "QN-K48",
      description: "Khóa 48 - Hệ Quân nhu",
    },
    {
      id: 4,
      major_id: 2,
      name: "Quân nhu K49",
      code: "QN-K49",
      description: "Khóa 49 - Hệ Quân nhu",
    },
    // Xăng dầu
    {
      id: 5,
      major_id: 3,
      name: "Xăng dầu K48",
      code: "XD-K48",
      description: "Khóa 48 - Hệ Xăng dầu",
    },
    // Vận tải
    {
      id: 6,
      major_id: 4,
      name: "Vận tải K48",
      code: "VT-K48",
      description: "Khóa 48 - Hệ Vận tải",
    },
  ];
  await knex(CLASSES_TABLE_NAME).insert(classes);

  // ==================== STUDENTS ====================
  const studentNames = [
    // HC-K48 (class_id: 1)
    { fullname: "Nguyễn Văn An", class_id: 1 },
    { fullname: "Trần Đức Bình", class_id: 1 },
    { fullname: "Lê Hoàng Cường", class_id: 1 },
    { fullname: "Phạm Minh Đức", class_id: 1 },
    { fullname: "Hoàng Văn Em", class_id: 1 },
    // HC-K49 (class_id: 2)
    { fullname: "Vũ Thị Phương", class_id: 2 },
    { fullname: "Đặng Quang Huy", class_id: 2 },
    { fullname: "Bùi Thành Long", class_id: 2 },
    // QN-K48 (class_id: 3)
    { fullname: "Ngô Thanh Sơn", class_id: 3 },
    { fullname: "Đỗ Hữu Tùng", class_id: 3 },
    { fullname: "Lý Văn Khoa", class_id: 3 },
    { fullname: "Mai Xuân Trường", class_id: 3 },
    { fullname: "Phan Đình Quân", class_id: 3 },
    { fullname: "Tạ Văn Hải", class_id: 3 },
    // QN-K49 (class_id: 4)
    { fullname: "Trịnh Quốc Việt", class_id: 4 },
    { fullname: "Cao Minh Tuấn", class_id: 4 },
    { fullname: "Đinh Thế Anh", class_id: 4 },
    { fullname: "Lương Văn Dũng", class_id: 4 },
    // XD-K48 (class_id: 5)
    { fullname: "Hà Mạnh Hùng", class_id: 5 },
    { fullname: "Châu Thanh Bảo", class_id: 5 },
    { fullname: "Dương Công Minh", class_id: 5 },
    // VT-K48 (class_id: 6)
    { fullname: "Tô Văn Thắng", class_id: 6 },
    { fullname: "Kiều Trọng Nghĩa", class_id: 6 },
    { fullname: "Lưu Quang Đạt", class_id: 6 },
    { fullname: "Huỳnh Bá Phước", class_id: 6 },
  ];

  const students = studentNames.map((s, index) => {
    const id = index + 1;
    const classObj = classes.find((c) => c.id === s.class_id);
    const studentCode = `${classObj?.code}-${String(id).padStart(3, "0")}`;
    const emailName = s.fullname
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .split(" ")
      .reverse()
      .join("");
    return {
      id,
      class_id: s.class_id,
      student_code: studentCode,
      fullname: s.fullname,
      email: `${emailName}@hv.quannhu.vn`,
      password: DEFAULT_PASSWORD_HASH,
      phone_number: `09${String(10000000 + id)}`,
      is_active: 1,
    };
  });

  await knex(STUDENTS_TABLE_NAME).insert(students);
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
}
