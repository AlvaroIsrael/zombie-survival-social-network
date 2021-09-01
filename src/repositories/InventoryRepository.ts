import Knex from 'knex';
import { IItemCreation } from 'interfaces/IItemCreation';
import { IInventoryRequest } from 'interfaces/IInventoryRequest';
import connection from '../database/connection';
import Inventory from '../models/Inventory';

class InventoryRepository {
  private readonly connection: Knex;

  constructor() {
    this.connection = Knex(connection);
  }

  /* Find one item for a specific survivor id. */
  public async findOnlyOne(survivorId: number, itemId: number): Promise<IInventoryRequest[]> {
    return this.connection<IInventoryRequest[]>('inventories')
      .join('items', 'inventories.itemId', '=', 'items.itemId')
      .select(
        'items.itemId as id',
        'itemName as name',
        'itemType as type',
        'itemValue as value',
        'inventoryQuantity as quantity',
      )
      .where({ survivorId, 'items.itemId': itemId })
      .limit(1);
  }

  /* Find one item for a specific survivor id. */
  public async findOne(survivorId: number, itemId: number): Promise<Inventory | null> {
    const foundInventory: IInventoryRequest[] = await this.connection<IInventoryRequest[]>('inventories')
      .join('items', 'inventories.itemId', '=', 'items.itemId')
      .select(
        'items.itemId as id',
        'itemName as name',
        'itemType as type',
        'itemValue as value',
        'inventoryQuantity as quantity',
      )
      .where({ survivorId, 'items.itemId': itemId })
      .limit(1);

    try {
      const [{ id, name, type, value, quantity }] = foundInventory;
      return new Inventory({ id, name, type, value, quantity });
    } catch (e) {
      return null;
    }
  }

  /* Remove one item for a specific survivor id. */
  public async removeOne(survivorId: number, itemId: number): Promise<number> {
    return this.connection('inventories').del().where({ survivorId, itemId });
  }

  /* Updates a survivor's inventory existing item. */
  public async inventoryUpdate({ survivorId, itemId, inventoryQuantity }: IItemCreation): Promise<number> {
    return this.connection('inventories').update({ survivorId, itemId, inventoryQuantity }).where({
      survivorId,
      itemId,
    });
  }

  /* Updates a survivor's inventory with a new item. */
  public async inventoryInsert({ survivorId, itemId, inventoryQuantity }: IItemCreation): Promise<number> {
    return this.connection('inventories').insert({ survivorId, itemId, inventoryQuantity });
  }
}

export default InventoryRepository;
