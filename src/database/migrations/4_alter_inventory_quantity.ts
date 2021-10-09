import Knex, { SchemaBuilder } from 'knex';

export async function up(knex: Knex): Promise<SchemaBuilder> {
  return knex.schema.table('inventories', tableBuilder => tableBuilder);
}

export async function down(knex: Knex): Promise<SchemaBuilder> {
  return knex.schema.table('inventories', tableBuilder => tableBuilder);
}
