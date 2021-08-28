import Knex from 'knex';
import { ISurvivorRequest } from 'interfaces/ISurvivorRequest';
import connection from '../database/connection';

class SurvivorRepository {
  private readonly connection: Knex;

  constructor() {
    this.connection = Knex(connection);
  }

  /* Creates a new survivor. */
  public async create({ name, age, sex, latitude, longitude, infected }: ISurvivorRequest): Promise<number> {
    const survivorId = await this.connection('survivors').returning('survivorId').insert({
      survivorName: name,
      survivorAge: age,
      survivorSex: sex,
      survivorLatitude: latitude,
      survivorLongitude: longitude,
      survivorInfected: infected,
    });

    return survivorId[0];
  }
}

export default SurvivorRepository;
