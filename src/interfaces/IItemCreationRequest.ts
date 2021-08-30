import { IInventoryItem } from 'interfaces/IInventoryItem';

export type IItemCreationRequest = {
  survivorId: number;
  inventory: IInventoryItem[];
}
