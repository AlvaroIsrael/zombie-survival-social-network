import { IItemRequest } from 'interfaces/IItemRequest';

class Item {
  name: string;

  type: string;

  value: number;

  constructor({ name, type, value }: IItemRequest) {
    this.name = name;
    this.type = type;
    this.value = value || 0;
  }
}

export default Item;
