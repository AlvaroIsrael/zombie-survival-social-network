import { ISurvivorInfectionRequest } from 'interfaces/ISurvivorInfectionRequest';
import InfectionsRepository from 'repositories/InfectionsRepository';
import SurvivorRepository from '../repositories/SurvivorRepository';
import AppError from '../errors/AppError';

class SurvivorInfectionService {
  private survivorRepository: SurvivorRepository;

  private infectionsRepository: InfectionsRepository;

  constructor(survivorRepository: SurvivorRepository, infectionsRepository: InfectionsRepository) {
    this.survivorRepository = survivorRepository;
    this.infectionsRepository = infectionsRepository;
  }

  public async execute({ reportedBy, infectedId }: ISurvivorInfectionRequest): Promise<number> {
    const survivor = await this.survivorRepository.findOne(infectedId);

    if (!survivor) {
      throw new AppError('Survivor not found');
    }

    const hasBeenReportedAlready = await this.infectionsRepository.hasBeenReportedAlready({ reportedBy, infectedId });

    if (hasBeenReportedAlready) {
      throw new AppError('You already reported the infection of this survivor once');
    }

    await this.infectionsRepository.reportInfected({ reportedBy, infectedId });

    const infectionReports = await this.infectionsRepository.infectionReports(infectedId);

    if (infectionReports < 3) {
      throw new AppError('Survivor not infected yet');
    }

    return this.survivorRepository.infectedUpdate(infectedId);
  }
}

export default SurvivorInfectionService;
