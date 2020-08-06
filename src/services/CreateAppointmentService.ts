import { getCustomRepository } from 'typeorm';
import { startOfHour } from 'date-fns';

import AppError from '../errors/AppError';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface RequestDTO {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async excute({ provider_id, date }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appoitmentDate = startOfHour(date);

    const findAppointmentInSomeDate = await appointmentsRepository.findByDate(
      appoitmentDate,
    );

    if (findAppointmentInSomeDate) {
      throw new AppError('This date or time is not available');
    }

    const createAppointment = appointmentsRepository.create({
      provider_id,
      date: appoitmentDate,
    });

    await appointmentsRepository.save(createAppointment);

    return createAppointment;
  }
}

export default CreateAppointmentService;
