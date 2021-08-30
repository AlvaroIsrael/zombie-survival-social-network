import { IInventoryRequest } from 'interfaces/IInventoryRequest';

class Inventory {
  name: string;

  type: string;

  value: number;

  quantity: number;

  constructor({ name, type, value, quantity }: IInventoryRequest) {
    this.name = name;
    this.type = type;
    this.value = value;
    this.quantity = quantity;
  }
}

export default Inventory;
