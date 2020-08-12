import { Router } from 'express';

import AppointmentsRoutes from '@modules/appointments/infra/http/routes/appointments.routes';
import UserRoutes from '@modules/users/infra/http/routes/users.routes';
import SessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';

const routes = Router();

routes.use('/appointments', AppointmentsRoutes);
routes.use('/users', UserRoutes);
routes.use('/sessions', SessionsRoutes);

export default routes;
