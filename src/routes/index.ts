import { Router } from 'express';

import AppointmentsRoutes from './appointments.routes';

const routes = Router();

routes.use('/appointments', AppointmentsRoutes);

export default routes;
