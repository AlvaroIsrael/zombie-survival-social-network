import Knex, { SchemaBuilder } from 'knex';

export async function up(knex: Knex): Promise<SchemaBuilder> {
  return knex.schema.createTable('infections', tableBuilder => {
    tableBuilder.increments('infectionId').primary();
    tableBuilder.string('reportedBy').notNullable().references('survivorId').inTable('survivors');
    tableBuilder.string('infectedId').notNullable().references('survivorId').inTable('survivors');
    tableBuilder.string('createdAt').notNullable().defaultTo(knex.fn.now());
    tableBuilder.string('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<SchemaBuilder> {
  return knex.schema.dropTable('infections');
}
