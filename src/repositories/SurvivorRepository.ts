import Knex from 'knex';
import { ISurvivorRequest } from 'interfaces/ISurvivorRequest';
import { ISurvivorUpdateLocationRequest } from 'interfaces/ISurvivorUpdateLocationRequest';
import { ISurvivor } from 'interfaces/ISurvivor';
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
      survivorInfected: infected,
    });

    return survivorId[0];
  }

  /* Updates a survivor's location. */
  public async locationUpdate({ survivorId, latitude, longitude }: ISurvivorUpdateLocationRequest): Promise<number> {
    return this.connection('survivors')
      .update({ survivorLatitude: latitude, survivorLongitude: longitude })
      .where({ survivorId });
  }

  /* Updates a survivor's infection status. */
  public async infectedUpdate(survivorId: number): Promise<number> {
    return this.connection('survivors').update({ survivorInfected: true }).where({ survivorId });
  }

  /* Find ond survivor by it's id. */
  public async findOne(survivorId: number): Promise<Survivor | null> {
    const foundSurvivor: Survivor[] = await this.connection<Survivor[]>('survivors')
      .select('name', 'age', 'sex', 'latitude', 'longitude', 'infected')
      .from('survivors')
      .where({ survivorId })
      .limit(1);

    try {
      const [{ name, age, sex, latitude, longitude, infected }] = foundSurvivor;
      return new Survivor({ name, age, sex, latitude, longitude, infected });
    } catch (e) {
      return null;
    }
  }

  public async exists({ name, age, sex, latitude, longitude }: ISurvivor): Promise<boolean> {
    const foundSurvivor = await this.connection('survivors')
      .select('survivorId')
      .from('survivors')
      .where({ name, age, sex, latitude, longitude })
      .limit(1);

    try {
      const [{ survivorId }] = foundSurvivor;
      return !!survivorId;
    } catch (e) {
      return false;
    }
  }
}

export default SurvivorRepository;
