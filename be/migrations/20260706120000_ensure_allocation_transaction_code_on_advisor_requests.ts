import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const hasAdvisorRequests = await knex.schema.hasTable("advisor_requests");
  if (!hasAdvisorRequests) return;

  const hasAllocationTransactionCode = await knex.schema.hasColumn(
    "advisor_requests",
    "allocation_transaction_code",
  );

  if (!hasAllocationTransactionCode) {
    await knex.schema.alterTable("advisor_requests", (table) => {
      table.string("allocation_transaction_code").nullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasAdvisorRequests = await knex.schema.hasTable("advisor_requests");
  if (!hasAdvisorRequests) return;

  const hasAllocationTransactionCode = await knex.schema.hasColumn(
    "advisor_requests",
    "allocation_transaction_code",
  );

  if (hasAllocationTransactionCode) {
    await knex.schema.alterTable("advisor_requests", (table) => {
      table.dropColumn("allocation_transaction_code");
    });
  }
}
