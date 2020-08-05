import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import { startOfHour } from 'date-fns';

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
      throw new Error('This date or time is not available');
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
