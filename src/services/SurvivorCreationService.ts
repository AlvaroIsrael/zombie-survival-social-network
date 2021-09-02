import { ISurvivorRequest } from 'interfaces/ISurvivorRequest';
import { StatusCodes } from 'http-status-codes';
import SurvivorRepository from '../repositories/SurvivorRepository';
import AppError from '../errors/AppError';

class SurvivorCreationService {
  private survivorRepository: SurvivorRepository;

  constructor(survivorRepository: SurvivorRepository) {
    this.survivorRepository = survivorRepository;
  }

  public async execute({ name, age, sex, latitude, longitude, infected }: ISurvivorRequest): Promise<number> {
    const survivorId = await this.survivorRepository.exists({ name, age, sex, latitude, longitude });

    if (survivorId) {
      throw new AppError('Survivor already exists', StatusCodes.CONFLICT);
    }

    return this.survivorRepository.create({ name, age, sex, latitude, longitude, infected });
  }
}

export default SurvivorCreationService;
