import { StatusCodes } from 'http-status-codes';
import { ISurvivorRequest } from 'interfaces/ISurvivorRequest';
import { ISurvivorUpdateLocationRequest } from 'interfaces/ISurvivorUpdateLocationRequest';
import SurvivorRepository from '../repositories/SurvivorRepository';
import AppError from '../errors/AppError';
import SurvivorUpdateLocationService from '../services/SurvivorUpdateLocationService';

let locationUpdate: ISurvivorUpdateLocationRequest;
let survivor: ISurvivorRequest;
let survivorRepository: SurvivorRepository;
let survivorUpdateLocationService: SurvivorUpdateLocationService;

describe('SurvivorUpdateLocationService', () => {
  beforeEach(() => {
    survivor = {
      name: 'Jhon Doe',
      age: 30,
      sex: 'M',
      latitude: 19.973349,
      longitude: 28.300781,
      infected: false,
    };
    locationUpdate = {
      survivorId: 1,
      latitude: survivor.latitude.toString(),
      longitude: survivor.longitude.toString(),
    };
    survivorRepository = new SurvivorRepository();
    survivorUpdateLocationService = new SurvivorUpdateLocationService(survivorRepository);
  });

  it('should return error 400 if survivor does not exist.', async () => {
    locationUpdate = {
      survivorId: 1,
      latitude: survivor.latitude.toString(),
      longitude: survivor.longitude.toString(),
    };

    const findOneStub = jest.spyOn(survivorRepository, 'findOne').mockReturnValue(Promise.resolve(null));

    try {
      await survivorUpdateLocationService.execute(locationUpdate);
    } catch (e) {
      expect(findOneStub).toHaveBeenCalledTimes(1);
      expect(findOneStub).toHaveBeenCalledWith(locationUpdate.survivorId);
      if (e instanceof AppError) {
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('Survivor not found');
      }
    }
  });

  it('should be able to update user location from database.', async () => {
    const findOneStub = jest.spyOn(survivorRepository, 'findOne').mockReturnValue(Promise.resolve(survivor));

    const survivorUpdateLocationServiceStub = jest
      .spyOn(survivorRepository, 'locationUpdate')
      .mockReturnValue(Promise.resolve(1));

    const locationId = await survivorUpdateLocationService.execute(locationUpdate);

    expect(findOneStub).toHaveBeenCalledTimes(1);
    expect(findOneStub).toHaveBeenCalledWith(locationUpdate.survivorId);

    expect(survivorUpdateLocationServiceStub).toHaveBeenCalledTimes(1);
    expect(survivorUpdateLocationServiceStub).toHaveBeenCalledWith(locationUpdate);

    expect(locationId).toEqual(1);
  });
});
