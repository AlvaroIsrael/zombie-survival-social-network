export type IItemRequest = {
  name: string;
  type: 'agua' | 'comida' | 'medicamento' | 'municao';
  value?: number;
};
