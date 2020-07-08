import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';

import AppointmentRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const routerAppointments = Router();

const appointmentsRepository = new AppointmentRepository();

routerAppointments.get('/', (resquest, response) => {
  const allAppointments = appointmentsRepository.all();
  return response.json(allAppointments);
});

routerAppointments.post('/', (resquest, response) => {
  try {
    const { provider, date } = resquest.body;

    const parsedDate = parseISO(date);

    const createAppointment = new CreateAppointmentService(
      appointmentsRepository,
    );

    const appointment = createAppointment.excute({
      date: parsedDate,
      provider,
    });

    return response.json(appointment);
  } catch (err) {
    return response.status(401).json({ error: err.message });
  }
});

export default routerAppointments;
