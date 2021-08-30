import { IItemCreationRequest } from 'interfaces/IItemCreationRequest';
import AppError from '../errors/AppError';
import SurvivorRepository from '../repositories/SurvivorRepository';
import ItemRepository from '../repositories/ItemRepository';
import InventoryRepository from '../repositories/InventoryRepository';

class SurvivorItemUpdateService {
  private survivorRepository: SurvivorRepository;

  private itemRepository: ItemRepository;

  private inventoryRepository: InventoryRepository;

  constructor(
    survivorRepository: SurvivorRepository,
    itemRepository: ItemRepository,
    inventoryRepository: InventoryRepository
  ) {
    this.survivorRepository = survivorRepository;
    this.itemRepository = itemRepository;
    this.inventoryRepository = inventoryRepository;
  }

  public async execute({ survivorId, inventory }: IItemCreationRequest): Promise<number[]> {
    const survivor = await this.survivorRepository.findOne(survivorId);

    if (!survivor) {
      throw new AppError('Survivor not found');
    }

    const inventoryUpdate = inventory.map(async inventoryItem => {
      const item = await this.itemRepository.findOneById(inventoryItem.itemId);

      if (!item) {
        throw new AppError('Item not found');
      }

      const inventoryItemExists = await this.inventoryRepository.findOne(survivorId, inventoryItem.itemId);

      if (!inventoryItemExists) {
        return this.inventoryRepository.inventoryInsert({
          survivorId,
          itemId: inventoryItem.itemId,
          inventoryQuantity: inventoryItem.quantity || 0
        });
      }

      return this.inventoryRepository.inventoryUpdate({
        survivorId,
        itemId: inventoryItem.itemId,
        inventoryQuantity: inventoryItem.quantity || 0
      });
    });

    return Promise.all(inventoryUpdate);
  }
}

export default SurvivorItemUpdateService;
