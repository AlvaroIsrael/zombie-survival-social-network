import { StatusCodes } from 'http-status-codes';
import { ISurvivorRequest } from 'interfaces/ISurvivorRequest';
import { ISurvivorInfectionRequest } from 'interfaces/ISurvivorInfectionRequest';
import SurvivorRepository from '../repositories/SurvivorRepository';
import AppError from '../errors/AppError';
import SurvivorInfectionService from '../services/SurvivorInfectionService';
import InfectionsRepository from '../repositories/InfectionsRepository';

let survivor: ISurvivorRequest;
let infection: ISurvivorInfectionRequest;
let survivorRepository: SurvivorRepository;
let infectionsRepository: InfectionsRepository;
let survivorInfectionService: SurvivorInfectionService;

describe('SurvivorInfectionService', () => {
  beforeEach(() => {
    survivor = {
      name: 'Jhon Doe',
      age: 30,
      sex: 'M',
      latitude: 19.973349,
      longitude: 28.300781,
      infected: false,
    };
    infection = { reportedBy: 1, infectedId: 2 };
    survivorRepository = new SurvivorRepository();
    infectionsRepository = new InfectionsRepository();
    survivorInfectionService = new SurvivorInfectionService(survivorRepository, infectionsRepository);
  });

  it('should return error 400 if survivor is not found.', async () => {
    const existsStub = jest.spyOn(survivorRepository, 'findOne').mockReturnValue(Promise.resolve(null));

    try {
      await survivorInfectionService.execute(infection);
    } catch (e) {
      expect(existsStub).toHaveBeenCalledTimes(1);
      expect(existsStub).toHaveBeenCalledWith(infection.infectedId);
      if (e instanceof AppError) {
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('Survivor not found');
      }
    }
  });

  it('should return error 400 if the report of a survivor is made more than once for the same person.', async () => {
    const existsStub = jest.spyOn(survivorRepository, 'findOne').mockReturnValue(Promise.resolve(survivor));

    const alreadyReportedStub = jest
      .spyOn(infectionsRepository, 'hasBeenReportedAlready')
      .mockReturnValue(Promise.resolve(1));

    try {
      await survivorInfectionService.execute(infection);
    } catch (e) {
      if (e instanceof AppError) {
        expect(existsStub).toHaveBeenCalledTimes(1);
        expect(existsStub).toHaveBeenCalledWith(infection.infectedId);

        expect(alreadyReportedStub).toHaveBeenCalledTimes(1);
        expect(alreadyReportedStub).toHaveBeenCalledWith({
          reportedBy: infection.reportedBy,
          infectedId: infection.infectedId,
        });

        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('You already reported the infection of this survivor once');
      }
    }
  });

  it('should return error 400 if a reported survivor has less than 3 reports.', async () => {
    const existsStub = jest.spyOn(survivorRepository, 'findOne').mockReturnValue(Promise.resolve(survivor));

    const alreadyReportedStub = jest
      .spyOn(infectionsRepository, 'hasBeenReportedAlready')
      .mockReturnValue(Promise.resolve(0));

    const reportInfected = jest.spyOn(infectionsRepository, 'reportInfected').mockReturnValue(Promise.resolve(1));

    const infectionReportsStub = jest
      .spyOn(infectionsRepository, 'infectionReports')
      .mockReturnValue(Promise.resolve(1));

    try {
      await survivorInfectionService.execute(infection);
    } catch (e) {
      if (e instanceof AppError) {
        expect(existsStub).toHaveBeenCalledTimes(1);
        expect(existsStub).toHaveBeenCalledWith(infection.infectedId);

        expect(alreadyReportedStub).toHaveBeenCalledTimes(1);
        expect(alreadyReportedStub).toHaveBeenCalledWith({
          reportedBy: infection.reportedBy,
          infectedId: infection.infectedId,
        });

        expect(reportInfected).toHaveBeenCalledTimes(1);
        expect(reportInfected).toHaveBeenCalledWith({
          reportedBy: infection.reportedBy,
          infectedId: infection.infectedId,
        });

        expect(infectionReportsStub).toHaveBeenCalledTimes(1);
        expect(infectionReportsStub).toHaveBeenCalledWith(infection.infectedId);

        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('Survivor not infected yet');
      }
    }
  });

  it('should be able to report the infection of a survivor return the newly created reportId.', async () => {
    const existsStub = jest.spyOn(survivorRepository, 'findOne').mockReturnValue(Promise.resolve(survivor));

    const alreadyReportedStub = jest
      .spyOn(infectionsRepository, 'hasBeenReportedAlready')
      .mockReturnValue(Promise.resolve(0));

    const reportInfectedStub = jest.spyOn(infectionsRepository, 'reportInfected').mockReturnValue(Promise.resolve(1));

    const infectionReportsStub = jest
      .spyOn(infectionsRepository, 'infectionReports')
      .mockReturnValue(Promise.resolve(4));

    const infectedUpdateStub = jest.spyOn(survivorRepository, 'infectedUpdate').mockReturnValue(Promise.resolve(1));

    await survivorInfectionService.execute(infection);

    expect(existsStub).toHaveBeenCalledTimes(1);
    expect(existsStub).toHaveBeenCalledWith(infection.infectedId);

    expect(alreadyReportedStub).toHaveBeenCalledTimes(1);
    expect(alreadyReportedStub).toHaveBeenCalledWith({
      reportedBy: infection.reportedBy,
      infectedId: infection.infectedId,
    });

    expect(reportInfectedStub).toHaveBeenCalledTimes(1);
    expect(reportInfectedStub).toHaveBeenCalledWith({
      reportedBy: infection.reportedBy,
      infectedId: infection.infectedId,
    });

    expect(infectionReportsStub).toHaveBeenCalledTimes(1);
    expect(infectionReportsStub).toHaveBeenCalledWith(infection.infectedId);

    expect(infectedUpdateStub).toHaveBeenCalledTimes(1);
    expect(infectedUpdateStub).toHaveBeenCalledWith(infection.infectedId);
  });
});
