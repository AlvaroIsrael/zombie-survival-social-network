import { IItemRequest } from 'interfaces/IItemRequest';
import { StatusCodes } from 'http-status-codes';
import ItemRepository from '../repositories/ItemRepository';
import AppError from '../errors/AppError';

const getItemValue = (type: string): number => {
  let itemValue: number;

  switch (type) {
    case 'agua':
      itemValue = 4;
      break;
    case 'comida':
      itemValue = 3;
      break;
    case 'medicamento':
      itemValue = 2;
      break;
    default:
      itemValue = 1;
  }

  return itemValue;
};

class ItemCreationService {
  private itemRepository: ItemRepository;

  constructor(itemRepository: ItemRepository) {
    this.itemRepository = itemRepository;
  }

  public async execute({ name, type }: IItemRequest): Promise<number> {
    const itemValue = getItemValue(type);

    const itemExists = await this.itemRepository.findOne(name);

    if (itemExists) {
      throw new AppError('Item already registered', StatusCodes.CONFLICT);
    }

    return this.itemRepository.create({ name, type, value: itemValue });
  }
}

export default ItemCreationService;
