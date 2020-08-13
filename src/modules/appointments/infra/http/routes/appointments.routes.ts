import { Router } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

import authMiddleware from '@modules/users/infra/http/middlewares/authMiddleware';
import AppointmentController from '../../Controllers/AppointmentController';

const routerAppointments = Router();

const appointmentController = new AppointmentController();

routerAppointments.use(authMiddleware);

// routerAppointments.get('/', async (resquest, response) => {
//   const allAppointments = await appointmentsRepository.find();
//   return response.json(allAppointments);
// });

routerAppointments.post('/', appointmentController.create);

export default routerAppointments;
