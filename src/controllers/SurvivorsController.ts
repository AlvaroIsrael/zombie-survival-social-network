import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ISurvivorRequest } from 'interfaces/ISurvivorRequest';
import SurvivorRepository from '../repositories/SurvivorRepository';
import SurvivorCreationService from '../services/SurvivorCreationService';

class SurvivorsController {
  private survivorRepository = new SurvivorRepository();

  private survivorCreationService = new SurvivorCreationService(this.survivorRepository);

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, age, sex, latitude, longitude, infected }: ISurvivorRequest = request.body;

    const survivorId = await this.survivorCreationService.execute({
      name,
      age,
      sex,
      latitude,
      longitude,
      infected,
    });

    return response.status(StatusCodes.CREATED).json({ survivorId });
  }
}

export default SurvivorsController;
