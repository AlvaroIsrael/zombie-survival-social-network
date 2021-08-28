import { ISurvivorRequest } from 'interfaces/ISurvivorRequest';
import SurvivorRepository from '../repositories/SurvivorRepository';

class SurvivorCreationService {
  private survivorRepository: SurvivorRepository;

  constructor(survivorRepository: SurvivorRepository) {
    this.survivorRepository = survivorRepository;
  }

  public async execute({ name, age, sex, latitude, longitude, infected }: ISurvivorRequest): Promise<number> {
    return this.survivorRepository.create({ name, age, sex, latitude, longitude, infected });
  }
}

export default SurvivorCreationService;
