import Knex, { SchemaBuilder } from 'knex';

export async function up(knex: Knex): Promise<SchemaBuilder> {
  return knex.schema.createTable('items', tableBuilder => {
    tableBuilder.increments('itemId').primary();
    tableBuilder.string('itemName').notNullable();
    tableBuilder.string('itemType').notNullable();
    tableBuilder.string('itemValue').notNullable();
    tableBuilder.string('createdAt').notNullable().defaultTo(knex.fn.now());
    tableBuilder.string('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<SchemaBuilder> {
  return knex.schema.dropTable('items');
}
