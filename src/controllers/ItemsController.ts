import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IItemRequest } from 'interfaces/IItemRequest';
import AppError from '../errors/AppError';
import ItemCreationService from '../services/ItemCreationService';
import ItemRepository from '../repositories/ItemRepository';

class ItemsController {
  private itemRepository = new ItemRepository();

  private itemCreationService = new ItemCreationService(this.itemRepository);

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, type, value }: IItemRequest = request.body;
    let itemId;

    try {
      itemId = await this.itemCreationService.execute({
        name,
        type,
        value
      });
    } catch (e) {
      if (e instanceof AppError) {
        return response.status(e.statusCode).json({ erro: e.message });
      }
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
    return response.status(StatusCodes.CREATED).json({ itemId });
  }
}

export default ItemsController;
