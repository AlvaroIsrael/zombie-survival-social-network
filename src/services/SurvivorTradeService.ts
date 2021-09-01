import { ITradeRequest } from 'interfaces/ITradeRequest';
import { StatusCodes } from 'http-status-codes';
import { IResource } from 'interfaces/IResource';
import { IInventoryItem } from 'interfaces/IInventoryItem';
import AppError from '../errors/AppError';
import SurvivorRepository from '../repositories/SurvivorRepository';
import ItemRepository from '../repositories/ItemRepository';
import InventoryRepository from '../repositories/InventoryRepository';
import SurvivorItemUpdateService from './SurvivorItemUpdateService';

const calculateTradeTotalValue = async (
  survivorId: number,
  resources: IResource[],
  inventoryRepository: InventoryRepository,
): Promise<number> => {
  const resourcesMap = resources.map(async item => {
    return inventoryRepository.findOne(survivorId, item.itemId);
  });

  const resourcesResolved = await Promise.all(resourcesMap);

  const validResources: number[] = [];

  resourcesResolved.forEach(inventoryItem => {
    if (inventoryItem !== null) {
      resources.forEach(resourceBeingTraded => {
        if (resourceBeingTraded.itemId === inventoryItem.id) {
          validResources.push(resourceBeingTraded.quantity * inventoryItem.value);
        }
      });
    }
  });

  return validResources.reduce((a, b) => Number(a) + Number(b), 0);
};

const balancedResources = async (
  { survivorId, buyerId, pick, pay }: ITradeRequest,
  inventoryRepository: InventoryRepository,
): Promise<boolean> => {
  const buyersTradeTotalAmmount = await calculateTradeTotalValue(buyerId, pay, inventoryRepository);
  const survivorsTradeTotalAmmount = await calculateTradeTotalValue(survivorId, pick, inventoryRepository);

  return buyersTradeTotalAmmount === survivorsTradeTotalAmmount;
};

const hasEnoughResources = async (
  buyerId: number,
  pay: IResource[],
  inventoryRepository: InventoryRepository,
): Promise<boolean> => {
  const checkResource = pay.map(async item => {
    return inventoryRepository.findOne(buyerId, item.itemId);
  });

  const resourcesResolved = await Promise.all(checkResource);

  const enoughResources: boolean[] = [];

  resourcesResolved.forEach(inventoryItem => {
    if (inventoryItem !== null) {
      pay.forEach(paymentItems => {
        if (paymentItems.itemId === inventoryItem.id) {
          enoughResources.push(inventoryItem.quantity >= paymentItems.quantity);
        }
      });
    }
  });

  return enoughResources.every(Boolean);
};

const subtractResources = async (
  survivorId: number,
  resources: IResource[],
  inventoryRepository: InventoryRepository,
): Promise<IInventoryItem[]> => {
  const inventory: IInventoryItem[] = [];

  const resourcesMap = resources.map(async item => {
    const inventoryItem = await inventoryRepository.findOnlyOne(survivorId, item.itemId);
    return inventoryItem[0];
  });

  const subtractResourcesResolved = await Promise.all(resourcesMap);

  subtractResourcesResolved.forEach(inventoryItem => {
    if (inventoryItem !== null) {
      resources.forEach(item => {
        if (item.itemId === inventoryItem.id) {
          inventory.push({
            itemId: inventoryItem.id,
            quantity: Number(inventoryItem.quantity) - item.quantity,
          });
        }
      });
    }
  });

  return inventory;
};

const addResources = async (
  survivorId: number,
  resources: IResource[],
  inventoryRepository: InventoryRepository,
): Promise<IInventoryItem[]> => {
  const inventory: IInventoryItem[] = [];

  const resourcesMap = resources.map(async item => {
    const inventoryItem = await inventoryRepository.findOnlyOne(survivorId, item.itemId);
    return inventoryItem[0];
  });

  const addResourcesResolved = await Promise.all(resourcesMap);

  addResourcesResolved.forEach(inventoryItem => {
    if (inventoryItem !== null) {
      resources.forEach(item => {
        if (item.itemId === inventoryItem.id) {
          inventory.push({
            itemId: inventoryItem.id,
            quantity: Number(inventoryItem.quantity) + item.quantity,
          });
        }
      });
    }
  });

  return inventory;
};

const trade = async (
  { survivorId, buyerId, pick, pay }: ITradeRequest,
  inventoryRepository: InventoryRepository,
  survivorItemUpdateService: SurvivorItemUpdateService,
): Promise<void> => {
  // Subtract payment itens from survivor's inventory.
  const subtractPaymentFromSurvivorInventory = await subtractResources(survivorId, pay, inventoryRepository);
  await survivorItemUpdateService.execute({ survivorId, inventory: subtractPaymentFromSurvivorInventory });

  // Add payment itens to buyer's inventory.
  const addPaymentToBuyersInventory = await addResources(buyerId, pay, inventoryRepository);
  await survivorItemUpdateService.execute({ survivorId: buyerId, inventory: addPaymentToBuyersInventory });

  // Subtract pick itens from buyer's inventory.
  const subtractPickedFromBuyersInventory = await subtractResources(buyerId, pick, inventoryRepository);
  await survivorItemUpdateService.execute({ survivorId: buyerId, inventory: subtractPickedFromBuyersInventory });

  // Add pick itens to survivor's inventory.
  const addPickedToSurvivorsInventory = await addResources(survivorId, pick, inventoryRepository);
  await survivorItemUpdateService.execute({ survivorId, inventory: addPickedToSurvivorsInventory });
};

class SurvivorTradeService {
  private readonly itemRepository: ItemRepository;

  private readonly survivorRepository: SurvivorRepository;

  private readonly inventoryRepository: InventoryRepository;

  private readonly survivorItemUpdateService: SurvivorItemUpdateService;

  constructor(
    survivorRepository: SurvivorRepository,
    itemRepository: ItemRepository,
    inventoryRepository: InventoryRepository,
    survivorItemUpdateService: SurvivorItemUpdateService,
  ) {
    this.survivorRepository = survivorRepository;
    this.itemRepository = itemRepository;
    this.inventoryRepository = inventoryRepository;
    this.survivorItemUpdateService = survivorItemUpdateService;
  }

  public async execute({ survivorId, buyerId, pick, pay }: ITradeRequest): Promise<void> {
    const survivor = await this.survivorRepository.findOne(survivorId);

    if (!survivor) {
      throw new AppError('Survivor not found');
    }

    const isSurvivorInfected = survivor.infected;

    if (isSurvivorInfected) {
      throw new AppError('Survivor is infected, can not trade', StatusCodes.CONFLICT);
    }

    const buyer = await this.survivorRepository.findOne(buyerId);

    if (!buyer) {
      throw new AppError('Buyer not found');
    }

    const isBuyerInfected = buyer.infected;

    if (isBuyerInfected) {
      throw new AppError('Buyer is infected, can not trade', StatusCodes.CONFLICT);
    }

    const sameSellerAndBuyer = survivorId === buyerId;

    if (sameSellerAndBuyer) {
      throw new AppError('You can not trade with yourself', StatusCodes.NOT_ACCEPTABLE);
    }

    const enoughResources = await hasEnoughResources(buyerId, pay, this.inventoryRepository);

    if (!enoughResources) {
      throw new AppError('Buyer does not have enough inventory resources, can not trade', StatusCodes.NOT_ACCEPTABLE);
    }

    const resourcesBalanced = await balancedResources({ survivorId, buyerId, pick, pay }, this.inventoryRepository);

    if (!resourcesBalanced) {
      throw new AppError('Items value are not balanced for both sides, can not trade', StatusCodes.NOT_ACCEPTABLE);
    }

    await trade({ survivorId, buyerId, pick, pay }, this.inventoryRepository, this.survivorItemUpdateService);
  }
}

export default SurvivorTradeService;
