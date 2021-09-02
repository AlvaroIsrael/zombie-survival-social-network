import { StatusCodes } from 'http-status-codes';
import { ISurvivorRequest } from 'interfaces/ISurvivorRequest';
import SurvivorRepository from '../repositories/SurvivorRepository';
import SurvivorCreationService from '../services/SurvivorCreationService';
import AppError from '../errors/AppError';

let survivor: ISurvivorRequest;
let survivorRepository: SurvivorRepository;
let survivorCreationService: SurvivorCreationService;

describe('SurvivorCreationService', () => {
  beforeEach(() => {
    survivor = {
      name: 'Jhon Doe',
      age: 30,
      sex: 'M',
      latitude: 19.973349,
      longitude: 28.300781,
      infected: false,
    };
    survivorRepository = new SurvivorRepository();
    survivorCreationService = new SurvivorCreationService(survivorRepository);
  });

  it('should return error 409 if survivor already exists.', async () => {
    const existsStub = jest.spyOn(survivorRepository, 'exists').mockReturnValue(Promise.resolve(true));

    try {
      await survivorCreationService.execute(survivor);
    } catch (e) {
      expect(existsStub).toHaveBeenCalledTimes(1);
      expect(existsStub).toHaveBeenCalledWith({
        name: survivor.name,
        age: survivor.age,
        sex: survivor.sex,
        latitude: survivor.latitude,
        longitude: survivor.longitude,
      });
      if (e instanceof AppError) {
        expect(e.statusCode).toEqual(StatusCodes.CONFLICT);
        expect(e.message).toEqual('Survivor already exists');
      }
    }
  });

  it('should be able to save the [survivor] in the database and return the newly created [survivorId].', async () => {
    const existsStub = jest.spyOn(survivorRepository, 'exists').mockReturnValue(Promise.resolve(false));

    const survivorCreationServiceStub = jest.spyOn(survivorRepository, 'create').mockReturnValue(Promise.resolve(1));

    const survivorId = await survivorCreationService.execute(survivor);

    expect(existsStub).toHaveBeenCalledTimes(1);
    expect(existsStub).toHaveBeenCalledWith({
      name: survivor.name,
      age: survivor.age,
      sex: survivor.sex,
      latitude: survivor.latitude,
      longitude: survivor.longitude,
    });

    expect(survivorCreationServiceStub).toHaveBeenCalledTimes(1);
    expect(survivorCreationServiceStub).toHaveBeenCalledWith(survivor);

    expect(survivorId).toEqual(1);
  });
});
