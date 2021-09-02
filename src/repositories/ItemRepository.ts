import Knex from 'knex';
import { IItemRequest } from 'interfaces/IItemRequest';
import Item from '../models/Item';
import connection from '../database/connection';

class ItemRepository {
  private readonly connection: Knex;

  constructor() {
    this.connection = Knex(connection);
  }

  /* Creates a new item. */
  public async create({ name, type, value }: IItemRequest): Promise<number> {
    const itemId = await this.connection('items').insert({
      itemName: name,
      itemType: type,
      itemValue: value,
    });

    return itemId[0];
  }

  /* Find one item by it's name. */
  public async findOne(itemName: string): Promise<Item | null> {
    const foundSurvivor: Item[] = await this.connection<Item[]>('items')
      .select('name', 'type', 'value')
      .from('items')
      .where({ itemName })
      .limit(1);

    try {
      const [{ name, type, value }] = foundSurvivor;
      return new Item({ name, type, value });
    } catch (e) {
      return null;
    }
  }

  /* Find one item by it's id. */
  public async findOneById(itemId: number): Promise<Item | null> {
    const foundSurvivor: Item[] = await this.connection<Item[]>('items')
      .select('name', 'type', 'value')
      .from('items')
      .where({ itemId })
      .limit(1);

    try {
      const [{ name, type, value }] = foundSurvivor;
      return new Item({ name, type, value });
    } catch (e) {
      return null;
    }
  }
}

export default ItemRepository;
