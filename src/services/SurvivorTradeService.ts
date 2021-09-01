import { ITradeRequest } from 'interfaces/ITradeRequest';
import { StatusCodes } from 'http-status-codes';
import { IResource } from 'interfaces/IResource';
import { IInventoryItem } from 'interfaces/IInventoryItem';
import AppError from '../errors/AppError';
import SurvivorRepository from '../repositories/SurvivorRepository';
import ItemRepository from '../repositories/ItemRepository';
import InventoryRepository from '../repositories/InventoryRepository';
import SurvivorItemUpdateService from './SurvivorItemUpdateService';

class SurvivorTradeService {
  private survivorRepository: SurvivorRepository;

  private itemRepository: ItemRepository;

  private inventoryRepository: InventoryRepository;

  private survivorItemUpdateService: SurvivorItemUpdateService;

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

  private calculateTradeTotalValue = async (survivorId: number, resources: IResource[]): Promise<number> => {
    const resourcesMap = resources.map(async item => {
      return this.inventoryRepository.findOne(survivorId, item.itemId);
    });

    const resourcesResolved = await Promise.all(resourcesMap);

    const validResources: number[] = [];

    resourcesResolved.forEach(item => (item !== null ? validResources.push(item.value) : null));

    return validResources.reduce((a, b) => a + b);
  };

  private balancedResources = async ({ survivorId, buyerId, pick, pay }: ITradeRequest): Promise<boolean> => {
    const buyersTradeTotalAmmount = await this.calculateTradeTotalValue(buyerId, pay);
    const survivorsTradeTotalAmmount = await this.calculateTradeTotalValue(survivorId, pick);

    return buyersTradeTotalAmmount === survivorsTradeTotalAmmount;
  };

  private hasEnoughResources = async (buyerId: number, pay: IResource[]): Promise<boolean> => {
    const checkResource = pay.map(async item => {
      const inventoryItem = await this.inventoryRepository.findOne(buyerId, item.itemId);
      return (inventoryItem?.quantity || 0) >= item.quantity;
    });

    return checkResource.every(Boolean);
  };

  private trade = async ({ survivorId, buyerId, pick, pay }: ITradeRequest): Promise<number> => {
    // Subtract payment itens from survivor's inventory.
    let inventory: IInventoryItem[] = [];

    const subtractSurvivorResources = pay.map(async itemPayment => {
      const inventoryItem = await this.inventoryRepository.findOne(survivorId, itemPayment.itemId);

      inventory.push({
        itemId: itemPayment.itemId,
        quantity: (inventoryItem?.quantity || 0) - itemPayment.quantity,
      });
    });

    await Promise.all(subtractSurvivorResources);
    await this.survivorItemUpdateService.execute({ survivorId, inventory });

    // Add payment itens to buyer's inventory.
    inventory = [];

    const addBuyersResources = pay.map(async itemPayment => {
      const inventoryItem = await this.inventoryRepository.findOne(buyerId, itemPayment.itemId);

      inventory.push({
        itemId: itemPayment.itemId,
        quantity: (inventoryItem?.quantity || 0) + itemPayment.quantity,
      });
    });

    await Promise.all(addBuyersResources);
    await this.survivorItemUpdateService.execute({ survivorId, inventory });

    // Subtract pick itens from buyer's inventory.
    inventory = [];

    const subtractBuyersResources = pick.map(async itemPayment => {
      const inventoryItem = await this.inventoryRepository.findOne(buyerId, itemPayment.itemId);

      inventory.push({
        itemId: itemPayment.itemId,
        quantity: (inventoryItem?.quantity || 0) - itemPayment.quantity,
      });
    });

    await Promise.all(subtractBuyersResources);
    await this.survivorItemUpdateService.execute({ survivorId: buyerId, inventory });

    // Add pick itens to survivor's inventory.
    inventory = [];

    const addSurvivorsResources = pick.map(async itemPayment => {
      const inventoryItem = await this.inventoryRepository.findOne(survivorId, itemPayment.itemId);

      inventory.push({
        itemId: itemPayment.itemId,
        quantity: (inventoryItem?.quantity || 0) + itemPayment.quantity,
      });
    });

    await Promise.all(addSurvivorsResources);
    await this.survivorItemUpdateService.execute({ survivorId, inventory });

    return 0;
  };

  public async execute({ survivorId, buyerId, pick, pay }: ITradeRequest): Promise<number> {
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

    const enoughResources = await this.hasEnoughResources(buyerId, pay);

    if (!enoughResources) {
      throw new AppError('Buyer does not have enough inventory resources, can not trade', StatusCodes.NOT_ACCEPTABLE);
    }

    const balancedResources = await this.balancedResources({ survivorId, buyerId, pick, pay });

    if (!balancedResources) {
      throw new AppError('Items value are not balanced for both sides, can not trade', StatusCodes.NOT_ACCEPTABLE);
    }

    return this.trade({ survivorId, buyerId, pick, pay });
  }
}

export default SurvivorTradeService;
