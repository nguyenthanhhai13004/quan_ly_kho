import db from "../src/v1/databases/init.mysql-v2";

type DuplicateValueRow = {
  value: string | number | null;
  total: string | number;
};

type DuplicateWarehouseUserRow = {
  user_id: number;
  warehouse_id: number;
  total: string | number;
};

async function findDuplicateValues(
  tableName: string,
  columnName: string,
  skipNull = true,
): Promise<DuplicateValueRow[]> {
  const query = db(tableName)
    .select(db.raw("?? as value", [columnName]))
    .count<DuplicateValueRow[]>({ total: "*" })
    .groupBy(columnName)
    .havingRaw("COUNT(*) > 1");

  if (skipNull) {
    query.whereNotNull(columnName);
  }

  return query;
}

async function findDuplicateWarehouseUsers(): Promise<
  DuplicateWarehouseUserRow[]
> {
  return db("warehouse_user")
    .select("user_id", "warehouse_id")
    .count<DuplicateWarehouseUserRow[]>({ total: "*" })
    .groupBy("user_id", "warehouse_id")
    .havingRaw("COUNT(*) > 1");
}

async function countInvalidAddressProvince(): Promise<number> {
  if (!(await db.schema.hasColumn("address", "province_code"))) return 0;

  const row = await db("address")
    .leftJoin("provinces", "provinces.code", "address.province_code")
    .whereNotNull("address.province_code")
    .whereNull("provinces.code")
    .count<{ total: string | number }[]>({ total: "address.id" })
    .first();

  return Number(row?.total || 0);
}

async function countInvalidAddressWard(): Promise<number> {
  if (!(await db.schema.hasColumn("address", "ward_code"))) return 0;

  const row = await db("address")
    .leftJoin("wards", "wards.code", "address.ward_code")
    .whereNotNull("address.ward_code")
    .whereNull("wards.code")
    .count<{ total: string | number }[]>({ total: "address.id" })
    .first();

  return Number(row?.total || 0);
}

async function countMismatchedAddressWardProvince(): Promise<number> {
  const [hasProvinceCode, hasWardCode] = await Promise.all([
    db.schema.hasColumn("address", "province_code"),
    db.schema.hasColumn("address", "ward_code"),
  ]);

  if (!hasProvinceCode || !hasWardCode) return 0;

  const row = await db("address")
    .join("wards", "wards.code", "address.ward_code")
    .whereNotNull("address.province_code")
    .whereNotNull("address.ward_code")
    .whereRaw("address.province_code <> wards.province_code")
    .count<{ total: string | number }[]>({ total: "address.id" })
    .first();

  return Number(row?.total || 0);
}

function formatDuplicateRows(rows: DuplicateValueRow[]): string {
  return rows
    .map((row) => `${String(row.value)} (${Number(row.total)} rows)`)
    .join(", ");
}

async function main(): Promise<void> {
  const duplicateChecks: Array<[string, Promise<DuplicateValueRow[]>]> = [
    ["users.username", findDuplicateValues("users", "username")],
    ["users.email", findDuplicateValues("users", "email")],
    ["categories.code", findDuplicateValues("categories", "code")],
    ["categories.name", findDuplicateValues("categories", "name")],
    ["assets.code", findDuplicateValues("assets", "code")],
    ["warehouses.code", findDuplicateValues("warehouses", "code")],
    ["warehouses.name", findDuplicateValues("warehouses", "name")],
    [
      "warehouse_asset.batch_code",
      findDuplicateValues("warehouse_asset", "batch_code"),
    ],
    [
      "asset_transactions.code",
      findDuplicateValues("asset_transactions", "code"),
    ],
  ];

  const errors: string[] = [];

  for (const [label, check] of duplicateChecks) {
    const rows = await check;
    if (rows.length > 0) {
      errors.push(`${label} duplicates: ${formatDuplicateRows(rows)}`);
    }
  }

  const duplicateWarehouseUsers = await findDuplicateWarehouseUsers();
  if (duplicateWarehouseUsers.length > 0) {
    errors.push(
      `warehouse_user duplicates: ${duplicateWarehouseUsers
        .map(
          (row) =>
            `user_id=${row.user_id}, warehouse_id=${row.warehouse_id} (${Number(row.total)} rows)`,
        )
        .join(", ")}`,
    );
  }

  const [invalidProvinceCount, invalidWardCount, mismatchedWardProvinceCount] =
    await Promise.all([
      countInvalidAddressProvince(),
      countInvalidAddressWard(),
      countMismatchedAddressWardProvince(),
    ]);

  if (invalidProvinceCount > 0) {
    errors.push(
      `address rows with invalid province_code: ${invalidProvinceCount}`,
    );
  }

  if (invalidWardCount > 0) {
    errors.push(`address rows with invalid ward_code: ${invalidWardCount}`);
  }

  if (mismatchedWardProvinceCount > 0) {
    errors.push(
      `address rows where ward_code does not belong to province_code: ${mismatchedWardProvinceCount}`,
    );
  }

  if (errors.length > 0) {
    throw new Error(
      `Database constraint readiness failed:\n- ${errors.join("\n- ")}`,
    );
  }

  console.log("Database constraint readiness passed.");
}

function getErrorCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const maybeError = error as { code?: string; errors?: Array<{ code?: string }> };
  return maybeError.code || maybeError.errors?.find((item) => item.code)?.code;
}

main()
  .catch((error) => {
    if (getErrorCode(error) === "ECONNREFUSED") {
      console.error(
        "Cannot connect to the configured MySQL database. Start MySQL or check DEV_DB_HOST/DEV_DB_PORT in .env, then rerun npm run test:db-data.",
      );
    } else {
      console.error(error instanceof Error ? error.message : error);
    }
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.destroy();
  });
