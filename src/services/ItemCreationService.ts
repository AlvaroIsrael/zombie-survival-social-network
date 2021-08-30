import { IItemRequest } from 'interfaces/IItemRequest';
import ItemRepository from '../repositories/ItemRepository';
import AppError from '../errors/AppError';

const getItemValue = (type: string): number => {
  let itemValue: number;

  switch (type) {
    case 'água':
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
      throw new AppError('Item already registered');
    }

    return this.itemRepository.create({ name, type, value: itemValue });
  }
}

export default ItemCreationService;
