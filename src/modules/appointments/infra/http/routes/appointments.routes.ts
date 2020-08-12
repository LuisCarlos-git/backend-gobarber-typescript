import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import AppointmentRepository from '@modules/appointments/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

import authMiddleware from '@modules/users/infra/http/middlewares/authMiddleware';

const routerAppointments = Router();

routerAppointments.use(authMiddleware);

routerAppointments.get('/', async (resquest, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentRepository);
  const allAppointments = await appointmentsRepository.find();
  return response.json(allAppointments);
});

routerAppointments.post('/', async (resquest, response) => {
  const { provider_id, date } = resquest.body;

  const parsedDate = parseISO(date);
  const createAppointment = new CreateAppointmentService();

  const appointment = await createAppointment.excute({
    date: parsedDate,
    provider_id,
  });

  return response.json(appointment);
});

export default routerAppointments;
