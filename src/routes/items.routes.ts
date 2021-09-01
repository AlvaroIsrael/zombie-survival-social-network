import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import ItemsController from '../controllers/ItemsController';

const itemsRouter = Router();
const itemsController = new ItemsController();

itemsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      type: Joi.string().valid('agua', 'comida', 'medicamento', 'municao').required()
    }
  }),
  async (request, response) => {
    await itemsController.create(request, response);
    response.end();
  }
);

export default itemsRouter;
