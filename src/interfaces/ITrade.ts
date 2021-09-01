import { IResource } from 'interfaces/IResource';

export type ITrade = {
  buyerId: number;
  pick: IResource[];
  pay: IResource[];
};
