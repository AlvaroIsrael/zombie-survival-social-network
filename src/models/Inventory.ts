import { IInventoryRequest } from 'interfaces/IInventoryRequest';

class Inventory {
  id: number;

  name: string;

  type: string;

  value: number;

  quantity: number;

  constructor({ id, name, type, value, quantity }: IInventoryRequest) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.value = value;
    this.quantity = quantity;
  }
}

export default Inventory;
