import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import { startOfHour } from 'date-fns';

interface RequestDTO {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private appointmentsRepository: AppointmentsRepository;

  constructor(appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public excute({ provider, date }: RequestDTO) {
    const appoitmentDate = startOfHour(date);

    const findAppointmentInSomeDate = this.appointmentsRepository.findByDate(
      appoitmentDate,
    );

    if (findAppointmentInSomeDate) {
      throw Error('This date or time is not available');
    }

    const createAppointment = this.appointmentsRepository.create({
      provider,
      date: appoitmentDate,
    });

    return createAppointment;
  }
}

export default CreateAppointmentService;
