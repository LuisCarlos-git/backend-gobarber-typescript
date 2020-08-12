import { startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async excute({
    provider_id,
    date,
  }: IRequestDTO): Promise<Appointment> {
    const appoitmentDate = startOfHour(date);

    const findAppointmentInSomeDate = await this.appointmentsRepository.findByDate(
      appoitmentDate,
    );

    if (findAppointmentInSomeDate) {
      throw new AppError('This date or time is not available');
    }

    const createAppointment = await this.appointmentsRepository.create({
      provider_id,
      date: appoitmentDate,
    });

    return createAppointment;
  }
}

export default CreateAppointmentService;
