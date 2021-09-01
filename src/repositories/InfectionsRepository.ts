import Knex from 'knex';
import { ISurvivorInfectionRequest } from 'interfaces/ISurvivorInfectionRequest';
import connection from '../database/connection';

class InfectionsRepository {
  private readonly connection: Knex;

  constructor() {
    this.connection = Knex(connection);
  }

  /* Reports a new infected survivor. */
  public async reportInfected({ reportedBy, infectedId }: ISurvivorInfectionRequest): Promise<number> {
    const infected = await this.connection('infections').insert({
      reportedBy,
      infectedId,
    });

    return infected[0];
  }

  /* Find if a survivor has already reported another survivor. */
  public async hasBeenReportedAlready({ reportedBy, infectedId }: ISurvivorInfectionRequest): Promise<number> {
    const [infectionReports] = await this.connection('infections')
      .count('reportedBy')
      .from('infections')
      .where({ reportedBy, infectedId })
      .limit(1);

    return Number(Object.entries(infectionReports)[0][1]);
  }

  /* Return how many infection reports from different survivors another survivor has. */
  public async infectionReports(survivorId: number): Promise<number> {
    const [infectionReports] = await this.connection('infections')
      .countDistinct('reportedBy')
      .from('infections')
      .where({ infectedId: survivorId });

    return Number(Object.entries(infectionReports)[0][1]);
  }
}

export default InfectionsRepository;
