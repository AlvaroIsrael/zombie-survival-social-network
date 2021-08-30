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
      itemValue: value
    });

    return itemId[0];
  }

  /* Find one item by it's name. */
  public async findOne(itemName: string): Promise<Item | null> {
    const foundSurvivor = await this.connection('items')
      .select(['*'])
      .from('items')
      .where({ itemName })
      .limit(1);

    let item: Item | null = null;
    foundSurvivor.forEach(itemInDataBase => {
      const { name, type, value } = itemInDataBase;
      item = new Item({ name, type, value });
    });

    return item;
  }

  /* Find one item by it's id. */
  public async findOneById(itemId: number): Promise<Item | null> {
    const foundSurvivor = await this.connection('items')
      .select(['*'])
      .from('items')
      .where({ itemId })
      .limit(1);

    let item: Item | null = null;
    foundSurvivor.forEach(itemInDataBase => {
      const { name, type, value } = itemInDataBase;
      item = new Item({ name, type, value });
    });

    return item;
  }
}

export default ItemRepository;
