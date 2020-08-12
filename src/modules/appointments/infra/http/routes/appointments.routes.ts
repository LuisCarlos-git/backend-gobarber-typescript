import { Router } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

import authMiddleware from '@modules/users/infra/http/middlewares/authMiddleware';

const routerAppointments = Router();

routerAppointments.use(authMiddleware);

// routerAppointments.get('/', async (resquest, response) => {
//   const allAppointments = await appointmentsRepository.find();
//   return response.json(allAppointments);
// });

routerAppointments.post('/', async (resquest, response) => {
  const { provider_id, date } = resquest.body;

  const parsedDate = parseISO(date);
  const createAppointment = container.resolve(CreateAppointmentService);

  const appointment = await createAppointment.excute({
    date: parsedDate,
    provider_id,
  });

  return response.json(appointment);
});

export default routerAppointments;
