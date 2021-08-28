import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ISurvivorRequest } from 'interfaces/ISurvivorRequest';
import SurvivorRepository from '../repositories/SurvivorRepository';
import SurvivorCreationService from '../services/SurvivorCreationService';
import SurvivorUpdateLocationService from '../services/SurvivorUpdateLocationService';
import AppError from '../errors/AppError';
import SurvivorInfectionService from '../services/SurvivorInfectionService';
import InfectionsRepository from '../repositories/InfectionsRepository';

class SurvivorsController {
  private survivorRepository = new SurvivorRepository();

  private infectionsRepository = new InfectionsRepository();

  private survivorCreationService = new SurvivorCreationService(this.survivorRepository);

  private survivorUpdateLocationService = new SurvivorUpdateLocationService(this.survivorRepository);

  private survivorInfectionService = new SurvivorInfectionService(this.survivorRepository, this.infectionsRepository);

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

  public async infection(request: Request, response: Response): Promise<Response> {
    const reportedBy = Number(request.params.reportedBy);
    const infectedId = Number(request.body.infectedId);

    try {
      await this.survivorInfectionService.execute({
        reportedBy,
        infectedId
      });
    } catch (e) {
      if (e instanceof AppError) {
        return response.status(e.statusCode).json({ erro: e.message });
      }
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return response.status(StatusCodes.OK).json({ message: 'Infection reported' });
  }
}

export default SurvivorsController;
