import Knex, { SchemaBuilder } from 'knex';

export async function up(knex: Knex): Promise<SchemaBuilder> {
  return knex.schema.createTable('inventories', tableBuilder => {
    tableBuilder.increments('inventoryId').primary();
    tableBuilder.string('survivorId').notNullable().references('survivorId').inTable('survivors');
    tableBuilder.string('itemId').notNullable().references('itemId').inTable('items');
    tableBuilder.string('inventoryQuantity').notNullable();
    tableBuilder.string('createdAt').notNullable().defaultTo(knex.fn.now());
    tableBuilder.string('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<SchemaBuilder> {
  return knex.schema.dropTable('inventories');
}
