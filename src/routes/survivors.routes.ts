import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import SurvivorsController from '../controllers/SurvivorsController';

const survivorsRouter = Router();
const survivorsController = new SurvivorsController();

/* celebrate allow us to validate parameters as a middleware, so we don't need unecessaru try catch in controller. */
survivorsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      age: Joi.number().required(),
      sex: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      infected: Joi.boolean().required(),
    },
  }),
  async (request, response) => {
    await survivorsController.create(request, response);
    response.end();
  },
);

survivorsRouter.patch(
  '/:survivorId',
  celebrate({
    [Segments.BODY]: {
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
    },
    [Segments.PARAMS]: {
      survivorId: Joi.number().required(),
    },
  }),
  async (request, response) => {
    await survivorsController.locationUpdate(request, response);
    response.end();
  },
);

survivorsRouter.post(
  '/:reportedBy/infection',
  celebrate({
    [Segments.PARAMS]: {
      reportedBy: Joi.number().required(),
    },
    [Segments.BODY]: {
      infectedId: Joi.number().required(),
    },
  }),
  async (request, response) => {
    await survivorsController.infection(request, response);
    response.end();
  },
);

survivorsRouter.patch(
  '/:survivorId/inventory',
  celebrate({
    [Segments.BODY]: {
      inventory: Joi.array()
        .items(
          Joi.object().keys({
            itemId: Joi.number().required(),
            quantity: Joi.number().positive().required(),
          }),
        )
        .min(1),
    },
    [Segments.PARAMS]: {
      survivorId: Joi.number().required(),
    },
  }),
  async (request, response) => {
    await survivorsController.inventoryUpdate(request, response);
    response.end();
  },
);

survivorsRouter.delete(
  '/:survivorId/inventory',
  celebrate({
    [Segments.BODY]: {
      inventory: Joi.array()
        .items(
          Joi.object().keys({
            itemId: Joi.number().required(),
          }),
        )
        .min(1),
    },
    [Segments.PARAMS]: {
      survivorId: Joi.number().required(),
    },
  }),
  async (request, response) => {
    await survivorsController.inventoryRemoval(request, response);
    response.end();
  },
);

export default survivorsRouter;
