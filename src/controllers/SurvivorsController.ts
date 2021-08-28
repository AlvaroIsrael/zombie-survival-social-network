import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ISurvivorRequest } from 'interfaces/ISurvivorRequest';
import SurvivorRepository from '../repositories/SurvivorRepository';
import SurvivorCreationService from '../services/SurvivorCreationService';
import SurvivorUpdateLocationService from '../services/SurvivorUpdateLocationService';
import AppError from '../errors/AppError';

class SurvivorsController {
  private survivorRepository = new SurvivorRepository();

  private survivorCreationService = new SurvivorCreationService(this.survivorRepository);

  private survivorUpdateLocationService = new SurvivorUpdateLocationService(this.survivorRepository);

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, age, sex, latitude, longitude, infected }: ISurvivorRequest = request.body;

    const survivorId = await this.survivorCreationService.execute({
      name,
      age,
      sex,
      latitude,
      longitude,
      infected
    });

    return response.status(StatusCodes.CREATED).json({ survivorId });
  }

  public async locationUpdate(request: Request, response: Response): Promise<Response> {
    const survivorId = Number(request.params.survivorId);
    const { latitude, longitude } = request.body;

    try {
      await this.survivorUpdateLocationService.execute({
        survivorId,
        latitude,
        longitude
      });
    } catch (e) {
      if (e instanceof AppError) {
        return response.status(e.statusCode).json({ erro: e.message });
      }
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return response.status(StatusCodes.NO_CONTENT);
  }
}

export default SurvivorsController;
