import { LoginDto } from "../dtos/auth/login.dto";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
} from "../cores/error.response";
import { comparePassword, hashPassword } from "../auths/utils";
import { createKeyPair } from "../auths";
import studentRepository from "../repositories/student.repository";
import { getInfoData } from "../utils/get-info-data";
import db from "../databases/init.mysql-v2";

class StudentAuthService {
  static async login(loginDto: LoginDto): Promise<any> {
    // For students, username is student_code or email
    let studentFound = await studentRepository.findByCode(loginDto.username);
    if (!studentFound) {
      studentFound = await studentRepository.findByEmail(loginDto.username);
    }

    if (!studentFound) {
      throw new NotFoundError("Mã học viên/Email hoặc mật khẩu chưa chính xác");
    }

    if (!studentFound.is_active) {
      throw new UnauthorizedError("Tài khoản chưa được kích hoạt");
    }

    const isMatch = await comparePassword(
      loginDto.password,
      studentFound.password!
    );

    if (!isMatch) {
      throw new NotFoundError("Mã học viên/Email hoặc mật khẩu chưa chính xác");
    }

    const tokens = await createKeyPair({
      email: studentFound.email,
      id: studentFound.id,
      username: studentFound.student_code,
      role_name: "student", // pseudo role for guards
      role_id: 0,
      fullname: studentFound.fullname,
      warehouse_ids: [],
    });

    if (!tokens) {
      throw new InternalServerError("Có lỗi xảy ra, vui lòng thử lại");
    }

    const userProfile = await this.me(studentFound.id);

    return {
      user: {
        ...userProfile,
        role: "student",
      },
      tokens,
    };
  }

  static async me(id: number): Promise<any> {
    const studentFound = await db("students as s")
      .select(
        "s.id",
        "s.fullname",
        "s.student_code",
        "s.email",
        "s.phone_number",
        "s.class_id",
        "s.created_at",
        "c.name as class_name",
        "c.code as class_code",
        "m.name as major_name",
        "m.code as major_code"
      )
      .leftJoin("classes as c", "s.class_id", "c.id")
      .leftJoin("majors as m", "c.major_id", "m.id")
      .where("s.id", id)
      .first();

    if (!studentFound) {
      throw new NotFoundError();
    }
    
    return studentFound;
  }

  static async updateProfile(id: number, data: any): Promise<any> {
    const { fullname, phone_number, email } = data;
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new NotFoundError("Học viên không tồn tại");
    }
    if (email && email !== student.email) {
      const existing = await studentRepository.findByEmail(email);
      if (existing) {
        throw new BadRequestError("Email đã được sử dụng");
      }
    }
    await studentRepository.update(id, { fullname, phone_number, email });
    return this.me(id);
  }

  static async changePassword(id: number, data: any): Promise<any> {
    const { oldPassword, newPassword } = data;
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new NotFoundError("Học viên không tồn tại");
    }
    const isMatch = await comparePassword(oldPassword, student.password!);
    if (!isMatch) {
      throw new BadRequestError("Mật khẩu cũ không chính xác");
    }
    const passwordHash = await hashPassword(newPassword);
    await studentRepository.update(id, { password: passwordHash });
  }
}

export default StudentAuthService;
