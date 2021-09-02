import { StatusCodes } from 'http-status-codes';
import { IItemRequest } from 'interfaces/IItemRequest';
import Item from '../models/Item';
import ItemRepository from '../repositories/ItemRepository';
import ItemCreationService from '../services/ItemCreationService';
import AppError from '../errors/AppError';

let water: Item;
let food: Item;
let medicine: Item;
let ammunition: Item;
let itemRequest: IItemRequest;
let itemRepository: ItemRepository;
let itemCreationService: ItemCreationService;

describe('ItemCreationService', () => {
  beforeEach(() => {
    itemRequest = {
      name: 'Minalba',
      type: 'agua',
    };
    water = new Item({
      name: itemRequest.name,
      type: itemRequest.type,
      value: 4,
    });

    food = new Item({
      name: 'hamburguer',
      type: 'comida',
      value: 3,
    });

    medicine = new Item({
      name: 'dipirona',
      type: 'medicamento',
      value: 2,
    });

    ammunition = new Item({
      name: '9mm',
      type: 'municao',
      value: 1,
    });
    itemRepository = new ItemRepository();
    itemCreationService = new ItemCreationService(itemRepository);
  });

  it('should return error 409 if item already exists in the database.', async () => {
    const findOneStub = jest.spyOn(itemRepository, 'findOne').mockReturnValue(Promise.resolve(water));

    try {
      await itemCreationService.execute(itemRequest);
    } catch (e) {
      expect(findOneStub).toHaveBeenCalledTimes(1);
      expect(findOneStub).toHaveBeenCalledWith(itemRequest.name);
      if (e instanceof AppError) {
        expect(e.statusCode).toEqual(StatusCodes.CONFLICT);
        expect(e.message).toEqual('Item already registered');
      }
    }
  });

  it('should be able to save the [water] in the database and return the newly created [itemId].', async () => {
    itemRequest = {
      name: water.name,
      type: water.type,
    };
    const findOneStub = jest.spyOn(itemRepository, 'findOne').mockReturnValue(Promise.resolve(null));

    const itemCreationServiceStub = jest.spyOn(itemRepository, 'create').mockReturnValue(Promise.resolve(1));

    const itemId = await itemCreationService.execute(itemRequest);

    expect(findOneStub).toHaveBeenCalledTimes(1);
    expect(findOneStub).toHaveBeenCalledWith(itemRequest.name);

    expect(itemCreationServiceStub).toHaveBeenCalledTimes(1);
    expect(itemCreationServiceStub).toHaveBeenCalledWith(water);

    expect(itemId).toEqual(1);
  });

  it('should be able to save the [food] in the database and return the newly created [itemId].', async () => {
    itemRequest = {
      name: food.name,
      type: food.type,
    };
    const findOneStub = jest.spyOn(itemRepository, 'findOne').mockReturnValue(Promise.resolve(null));

    const itemCreationServiceStub = jest.spyOn(itemRepository, 'create').mockReturnValue(Promise.resolve(1));

    const itemId = await itemCreationService.execute(itemRequest);

    expect(findOneStub).toHaveBeenCalledTimes(1);
    expect(findOneStub).toHaveBeenCalledWith(food.name);

    expect(itemCreationServiceStub).toHaveBeenCalledTimes(1);
    expect(itemCreationServiceStub).toHaveBeenCalledWith(food);

    expect(itemId).toEqual(1);
  });

  it('should be able to save the [medicine] in the database and return the newly created [itemId].', async () => {
    itemRequest = {
      name: medicine.name,
      type: medicine.type,
    };
    const findOneStub = jest.spyOn(itemRepository, 'findOne').mockReturnValue(Promise.resolve(null));

    const itemCreationServiceStub = jest.spyOn(itemRepository, 'create').mockReturnValue(Promise.resolve(1));

    const itemId = await itemCreationService.execute(itemRequest);

    expect(findOneStub).toHaveBeenCalledTimes(1);
    expect(findOneStub).toHaveBeenCalledWith(medicine.name);

    expect(itemCreationServiceStub).toHaveBeenCalledTimes(1);
    expect(itemCreationServiceStub).toHaveBeenCalledWith(medicine);

    expect(itemId).toEqual(1);
  });

  it('should be able to save the [ammunition] in the database and return the newly created [itemId].', async () => {
    itemRequest = {
      name: ammunition.name,
      type: ammunition.type,
    };
    const findOneStub = jest.spyOn(itemRepository, 'findOne').mockReturnValue(Promise.resolve(null));

    const itemCreationServiceStub = jest.spyOn(itemRepository, 'create').mockReturnValue(Promise.resolve(1));

    const itemId = await itemCreationService.execute(itemRequest);

    expect(findOneStub).toHaveBeenCalledTimes(1);
    expect(findOneStub).toHaveBeenCalledWith(ammunition.name);

    expect(itemCreationServiceStub).toHaveBeenCalledTimes(1);
    expect(itemCreationServiceStub).toHaveBeenCalledWith(ammunition);

    expect(itemId).toEqual(1);
  });
});
