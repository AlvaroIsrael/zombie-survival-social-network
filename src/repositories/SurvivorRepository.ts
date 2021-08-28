import Knex from 'knex';
import { ISurvivorRequest } from 'interfaces/ISurvivorRequest';
import { ISurvivorUpdateLocationRequest } from 'interfaces/ISurvivorUpdateLocationRequest';
import Survivor from '../models/Survivor';
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
      survivorInfected: infected
    });

    return survivorId[0];
  }

  /* Updates a survivor's location. */
  public async locationUpdate({ survivorId, latitude, longitude }: ISurvivorUpdateLocationRequest): Promise<number> {
    return this.connection('survivors')
      .update({ survivorLatitude: latitude, survivorLongitude: longitude })
      .where({ survivorId });
  }

  /* Find ond survivor by it's id. */
  public async findOne(survivorId: number): Promise<Survivor | null> {
    const foundSurvivor = await this.connection('survivors')
      .select(['*'])
      .from('survivors')
      .where({ survivorId })
      .limit(1);

    let survivor: Survivor | null = null;
    foundSurvivor.forEach(survivorInDataBase => {
      const { name, age, sex, latitude, longitude, infected } = survivorInDataBase;
      survivor = new Survivor({ name, age, sex, latitude, longitude, infected });
    });

    return survivor;
  }
}

export default SurvivorRepository;
