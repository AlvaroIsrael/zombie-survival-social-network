import { Router } from 'express';
import survivorsRouter from './survivors.routes';
import itemsRouter from './items.routes';

const routes = Router();

routes.use('/v1/survivors', survivorsRouter);
routes.use('/v1/items', itemsRouter);

export default routes;
