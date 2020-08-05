import { Router } from 'express';

import AppointmentsRoutes from './appointments.routes';
import UserRoutes from './users.routes';

const routes = Router();

routes.use('/appointments', AppointmentsRoutes);
routes.use('/users', UserRoutes);

export default routes;
