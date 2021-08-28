import Knex, { SchemaBuilder } from 'knex';

export async function up(knex: Knex): Promise<SchemaBuilder> {
  return knex.schema.createTable('survivors', tableBuilder => {
    tableBuilder.increments('survivorId').primary();
    tableBuilder.string('survivorName').notNullable();
    tableBuilder.string('survivorAge').notNullable();
    tableBuilder.string('survivorSex').notNullable();
    tableBuilder.float('survivorLatitude', 14, 10).notNullable();
    tableBuilder.float('survivorLongitude', 14, 10).notNullable();
    tableBuilder.string('survivorInfected').notNullable();
    tableBuilder.string('createdAt').notNullable().defaultTo(knex.fn.now());
    tableBuilder.string('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<SchemaBuilder> {
  return knex.schema.dropTable('survivors');
}
