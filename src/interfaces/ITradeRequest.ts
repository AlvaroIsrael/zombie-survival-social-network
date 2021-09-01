import { IResource } from 'interfaces/IResource';

export type ITradeRequest = {
  survivorId: number;
  buyerId: number;
  pick: IResource[];
  pay: IResource[];
};
