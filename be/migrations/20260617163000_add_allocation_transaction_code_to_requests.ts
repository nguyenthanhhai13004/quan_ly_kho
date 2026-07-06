import type { Knex } from "knex";

// Migration them advisor_requests.allocation_transaction_code.
// Cot nay luu ma phieu cap phat goc khi tao yeu cau thu hoi, de can bo kho biet thu hoi tu phieu nao.
// Day la lien ket nghiep vu toi asset_transactions.code, khong phai FK vat ly.
export async function up(knex: Knex): Promise<void> {
  const hasAdvisorRequests = await knex.schema.hasTable("advisor_requests");
  if (hasAdvisorRequests) {
    await knex.schema.alterTable("advisor_requests", (table) => {
      table.string("allocation_transaction_code").nullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasAdvisorRequests = await knex.schema.hasTable("advisor_requests");
  if (hasAdvisorRequests) {
    // Rollback bo ma phieu cap phat goc khoi request.
    await knex.schema.alterTable("advisor_requests", (table) => {
      table.dropColumn("allocation_transaction_code");
    });
  }
}
