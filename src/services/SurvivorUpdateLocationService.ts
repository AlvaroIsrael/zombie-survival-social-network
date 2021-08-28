import { ISurvivorUpdateLocationRequest } from 'interfaces/ISurvivorUpdateLocationRequest';
import AppError from '../errors/AppError';
import SurvivorRepository from '../repositories/SurvivorRepository';

class SurvivorUpdateLocationService {
  private survivorRepository: SurvivorRepository;

  constructor(survivorRepository: SurvivorRepository) {
    this.survivorRepository = survivorRepository;
  }

  public async execute({ survivorId, latitude, longitude }: ISurvivorUpdateLocationRequest): Promise<number> {
    const survivor = await this.survivorRepository.findOne(survivorId);

    if (!survivor) {
      throw new AppError('Survivor not found');
    }

    return this.survivorRepository.locationUpdate({ survivorId, latitude, longitude });
  }
}

export default SurvivorUpdateLocationService;
