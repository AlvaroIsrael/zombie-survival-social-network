import { Router } from 'express';
import survivorsRouter from './survivors.routes';

const routes = Router();

routes.use('/v1/survivors', survivorsRouter);

export default routes;
