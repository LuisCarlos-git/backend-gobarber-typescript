import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import AppointmentRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

import authMiddleware from '../middlewares/authMiddleware';

const routerAppointments = Router();

routerAppointments.use(authMiddleware);

routerAppointments.get('/', async (resquest, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentRepository);
  const allAppointments = await appointmentsRepository.find();
  return response.json(allAppointments);
});

routerAppointments.post('/', async (resquest, response) => {
  try {
    const { provider_id, date } = resquest.body;

    const parsedDate = parseISO(date);
    const createAppointment = new CreateAppointmentService();

    const appointment = await createAppointment.excute({
      date: parsedDate,
      provider_id,
    });

    return response.json(appointment);
  } catch (err) {
    return response.status(401).json({ error: err.message });
  }
});

export default routerAppointments;
