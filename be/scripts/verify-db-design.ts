import assert from "assert";
import fs from "fs";
import path from "path";
import { CreateUserSchema } from "../src/v1/dtos/user/create-user.dto";
import { UpdatedUserSchema } from "../src/v1/dtos/user/update-user.dto";

const backendRoot = process.cwd();
const reportRoot = path.resolve(backendRoot, "..", "..", "DATN_HAI");
const hinhveDir = path.join(reportRoot, "Hinhve");
const migrationPath = path.join(
  backendRoot,
  "migrations",
  "20260624090000_harden_database_design_constraints.ts",
);

function readFile(filePath: string): string {
  assert.ok(fs.existsSync(filePath), `Missing file: ${filePath}`);
  return fs.readFileSync(filePath, "utf8");
}

function expectContains(
  content: string,
  expected: string,
  label: string,
): void {
  assert.ok(content.includes(expected), `${label}: missing '${expected}'`);
}

function expectNoDbmlWarning(content: string, fileName: string): void {
  assert.ok(
    !content.includes("Unclear"),
    `${fileName}: contains Unclear comment`,
  );
  assert.ok(
    !content.includes("commented out"),
    `${fileName}: contains commented-out schema warning`,
  );
}

function testUserWarehouseValidation(): void {
  const createBase = {
    username: "user_01",
    fullname: "Test User",
    email: "user01@example.com",
    role_id: 3,
    warehouse_ids: [1, 2],
  };

  assert.strictEqual(CreateUserSchema.validate(createBase).error, undefined);
  assert.ok(
    CreateUserSchema.validate({ ...createBase, warehouse_ids: [1, 1] }).error,
    "CreateUserSchema must reject duplicate warehouse_ids",
  );
  assert.ok(
    CreateUserSchema.validate({ ...createBase, warehouse_ids: [0] }).error,
    "CreateUserSchema must reject non-positive warehouse_ids",
  );

  const updateBase = {
    fullname: "Test User",
    email: "user01@example.com",
    active: 1,
    warehouse_ids: [1, 2],
  };

  assert.strictEqual(UpdatedUserSchema.validate(updateBase).error, undefined);
  assert.ok(
    UpdatedUserSchema.validate({ ...updateBase, warehouse_ids: [2, 2] }).error,
    "UpdatedUserSchema must reject duplicate warehouse_ids",
  );
}

function testMigrationConstraints(): void {
  const migration = readFile(migrationPath);

  const expectedSnippets = [
    "ADD COLUMN `province_code` VARCHAR(20) NULL",
    "ADD COLUMN `ward_code` VARCHAR(20) NULL",
    "uq_users_username",
    "uq_users_email",
    "uq_categories_code",
    "uq_categories_name",
    "uq_assets_code",
    "uq_warehouses_code",
    "uq_warehouses_name",
    "uq_warehouse_asset_batch_code",
    "uq_asset_transactions_code",
    "ADD PRIMARY KEY (`user_id`, `warehouse_id`)",
    "fk_address_province_code",
    "fk_address_ward_code",
  ];

  for (const snippet of expectedSnippets) {
    expectContains(migration, snippet, "harden database design migration");
  }
}

function testDbmlFiles(): void {
  const expectedFiles = [
    "hinh_4_1_users_rbac.dbml",
    "hinh_4_2_training_classes_students.dbml",
    "hinh_4_3_assets_warehouses_inventory.dbml",
    "hinh_4_4_asset_transactions.dbml",
    "hinh_4_5_advisor_requests.dbml",
    "hinh_4_6_administrative_address.dbml",
    "hinh_4_7_system_logs.dbml",
  ];

  for (const fileName of expectedFiles) {
    const content = readFile(path.join(hinhveDir, fileName));
    expectNoDbmlWarning(content, fileName);
  }

  const usersRbac = readFile(path.join(hinhveDir, "hinh_4_1_users_rbac.dbml"));
  expectContains(
    usersRbac,
    "Ref: users.class_id > classes.id [delete: set null]",
    "users/rbac DBML",
  );
  expectContains(
    usersRbac,
    "Ref: users.major_id > majors.id [delete: set null]",
    "users/rbac DBML",
  );

  const inventory = readFile(
    path.join(hinhveDir, "hinh_4_3_assets_warehouses_inventory.dbml"),
  );
  expectContains(inventory, "province_code varchar(20)", "inventory DBML");
  expectContains(inventory, "ward_code varchar(20)", "inventory DBML");
  expectContains(inventory, "(user_id, warehouse_id) [pk]", "inventory DBML");
  expectContains(
    inventory,
    "Ref: warehouse_user.user_id > users.id [delete: cascade]",
    "inventory DBML",
  );

  const transactions = readFile(
    path.join(hinhveDir, "hinh_4_4_asset_transactions.dbml"),
  );
  expectContains(
    transactions,
    "Ref: asset_transactions.warehouse_id > warehouses.id [delete: set null]",
    "transactions DBML",
  );
  expectContains(
    transactions,
    "Ref: asset_transaction_items.warehouse_asset_id > warehouse_asset.id [delete: cascade]",
    "transactions DBML",
  );
  expectContains(
    transactions,
    "Ref: asset_lifecycle.receiver_id > users.id [delete: set null]",
    "transactions DBML",
  );

  const address = readFile(
    path.join(hinhveDir, "hinh_4_6_administrative_address.dbml"),
  );
  expectContains(
    address,
    "Ref: address.province_code > provinces.code [delete: set null]",
    "address DBML",
  );
  expectContains(
    address,
    "Ref: address.ward_code > wards.code [delete: set null]",
    "address DBML",
  );
}

function main(): void {
  testUserWarehouseValidation();
  testMigrationConstraints();
  testDbmlFiles();
  console.log("DB design verification passed.");
}

main();
