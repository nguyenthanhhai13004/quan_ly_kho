# migations and seeds db
npx knex migrate:rollback --all
npx knex migrate:make users
npx knex migrate:make add_new_column_to_users
npx knex seed:make users
npm run migrate:latest
npm run seed:run