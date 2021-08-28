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
      infected: Joi.boolean().required()
    }
  }),
  async (request, response) => {
    await survivorsController.create(request, response);
    response.end();
  }
);

survivorsRouter.patch(
  '/:survivorId',
  celebrate({
    [Segments.BODY]: {
      latitude: Joi.number().required(),
      longitude: Joi.number().required()
    },
    [Segments.PARAMS]: {
      survivorId: Joi.number().required()
    }
  }),
  async (request, response) => {
    await survivorsController.locationUpdate(request, response);
    response.end();
  }
);

export default survivorsRouter;
