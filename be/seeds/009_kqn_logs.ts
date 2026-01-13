import { Knex } from "knex";
import { LOG_ACTIONS_DEFAULT, LOG_CONTROLLERS_DEFAULT } from "../src/v1/cores/constants/kqn-logs.constant";

export async function seed(knex: Knex): Promise<void> {
    await knex("log_actions").del();
    await knex("log_controllers").del();

    await knex("log_actions").insert(LOG_ACTIONS_DEFAULT);
    await knex("log_controllers").insert(LOG_CONTROLLERS_DEFAULT);
};
