// import pool from "../databases/init.mysql";
import { User } from "../models/user.model";
import db from "../databases/init.mysql-v2";
import { USER_TABLE_NAME } from "../cores/constants/table-name.constant";
import { PaginationUsersDto } from "../dtos/user/pagination-users.dto";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
import UserStatusEnum from "../cores/enums/user-status.enum";

class UserRepository {
  async getAllUsers({
    size = 20,
    page = 1,
    keyword = "",
    active,
    role,
  }: PaginationUsersDto): Promise<ResponsePaginationDto<User>> {
    const offset = (page - 1) * size;
    let query = db<User>(USER_TABLE_NAME)
      .select("*")
      .where(function () {
        this.where("username", "like", `%${keyword}%`)
          .orWhere("email", "like", `%${keyword}%`)
          .orWhere("fullname", "like", `%${keyword}%`);
      });

    if (active) {
      query = query.where(function () {
        this.where("is_active", "=", active);
      });
    }

    if (role) {
      query = query.where(function () {
        this.where("role_id", "=", role);
      });
    }

    const totalQuery = query
      .clone()
      .clearSelect()
      .count<{ count: number }[]>("id as count");
    const [{ count }] = await totalQuery;

    const users = await query.limit(size).offset(offset).orderBy("id", "desc");
    return {
      items: users,
      size,
      page,
      total: Number(count),
      totalPages: Math.ceil(Number(count) / size),
    };
  }

  async findUserByUserName(username: string): Promise<User | null> {
    const user = await db<User>(USER_TABLE_NAME)
      .where("username", username)
      .first();
    return user || null;
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const user = await db(USER_TABLE_NAME).where({ username }).first("id");
    return !!user;
  }

  async findUserById(id: number): Promise<User & {warehouse_ids:number[]} | null> {
    const user = await db<User>(USER_TABLE_NAME).where("id", id).first();

    if (!user) return null;

    const warehouseRows = await db("warehouse_user")
      .where("warehouse_user.user_id", id)
      .pluck("warehouse_id");

    return {
      ...user,
      warehouse_ids: warehouseRows,
    };
  }

  async updateUserById(id: number, data: Partial<User>): Promise<User | null> {
    const updatedRows = await db<User>("users")
      .where({ id })
      .update(
        {
          ...data,
          updated_at: db.fn.now(),
        },
        ["*"],
      );

    if (Array.isArray(updatedRows) && updatedRows.length > 0) {
      return updatedRows[0];
    }

    const user = await db<User>("users").where({ id }).first();
    return user || null;
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const user = await db(USER_TABLE_NAME).where({ email }).first("id");
    return !!user;
  }

  async store(data: Partial<User>): Promise<User | null> {
    const [id] = await db(USER_TABLE_NAME).insert(data);
    const user = await db<User>(USER_TABLE_NAME).where({ id }).first();
    return user || null;
  }

  async userIsActive(userId: number): Promise<boolean> {
    const user = await db(USER_TABLE_NAME)
      .where({ id: userId })
      .first("is_active");
    return user?.is_active || false;
  }
}

export default new UserRepository();
