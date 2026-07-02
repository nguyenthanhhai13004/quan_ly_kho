import type { Knex } from "knex";

async function indexExists(
  knex: Knex,
  tableName: string,
  indexName: string,
): Promise<boolean> {
  const rows = await knex("information_schema.STATISTICS")
    .whereRaw("TABLE_SCHEMA = DATABASE()")
    .where("TABLE_NAME", tableName)
    .where("INDEX_NAME", indexName)
    .count<{ total: number }[]>({ total: "*" });

  return Number(rows[0]?.total || 0) > 0;
}

async function primaryKeyExists(
  knex: Knex,
  tableName: string,
): Promise<boolean> {
  const rows = await knex("information_schema.TABLE_CONSTRAINTS")
    .whereRaw("CONSTRAINT_SCHEMA = DATABASE()")
    .where("TABLE_NAME", tableName)
    .where("CONSTRAINT_NAME", "PRIMARY")
    .where("CONSTRAINT_TYPE", "PRIMARY KEY")
    .count<{ total: number }[]>({ total: "*" });

  return Number(rows[0]?.total || 0) > 0;
}

async function addUniqueIndex(
  knex: Knex,
  tableName: string,
  indexName: string,
  columns: string[],
): Promise<void> {
  if (await indexExists(knex, tableName, indexName)) return;

  const escapedColumns = columns.map((column) => `\`${column}\``).join(", ");
  await knex.raw(
    `ALTER TABLE \`${tableName}\` ADD UNIQUE INDEX \`${indexName}\` (${escapedColumns})`,
  );
}

async function dropIndexIfExists(
  knex: Knex,
  tableName: string,
  indexName: string,
): Promise<void> {
  if (!(await indexExists(knex, tableName, indexName))) return;

  await knex.raw(`ALTER TABLE \`${tableName}\` DROP INDEX \`${indexName}\``);
}

export async function up(knex: Knex): Promise<void> {
  await addUniqueIndex(knex, "users", "uq_users_username", ["username"]);
  await addUniqueIndex(knex, "users", "uq_users_email", ["email"]);
  await addUniqueIndex(knex, "categories", "uq_categories_code", ["code"]);
  await addUniqueIndex(knex, "categories", "uq_categories_name", ["name"]);
  await addUniqueIndex(knex, "assets", "uq_assets_code", ["code"]);
  await addUniqueIndex(knex, "warehouses", "uq_warehouses_code", ["code"]);
  await addUniqueIndex(knex, "warehouses", "uq_warehouses_name", ["name"]);
  await addUniqueIndex(
    knex,
    "warehouse_asset",
    "uq_warehouse_asset_batch_code",
    ["batch_code"],
  );
  await addUniqueIndex(
    knex,
    "asset_transactions",
    "uq_asset_transactions_code",
    ["code"],
  );

  if (!(await primaryKeyExists(knex, "warehouse_user"))) {
    await knex.raw(
      "ALTER TABLE `warehouse_user` ADD PRIMARY KEY (`user_id`, `warehouse_id`)",
    );
  }
}

export async function down(knex: Knex): Promise<void> {
  if (await primaryKeyExists(knex, "warehouse_user")) {
    await knex.raw("ALTER TABLE `warehouse_user` DROP PRIMARY KEY");
  }

  await dropIndexIfExists(
    knex,
    "asset_transactions",
    "uq_asset_transactions_code",
  );
  await dropIndexIfExists(
    knex,
    "warehouse_asset",
    "uq_warehouse_asset_batch_code",
  );
  await dropIndexIfExists(knex, "warehouses", "uq_warehouses_name");
  await dropIndexIfExists(knex, "warehouses", "uq_warehouses_code");
  await dropIndexIfExists(knex, "assets", "uq_assets_code");
  await dropIndexIfExists(knex, "categories", "uq_categories_name");
  await dropIndexIfExists(knex, "categories", "uq_categories_code");
  await dropIndexIfExists(knex, "users", "uq_users_email");
  await dropIndexIfExists(knex, "users", "uq_users_username");
}
