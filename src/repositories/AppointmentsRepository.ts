import { isEqual } from 'date-fns';

import Appointment from '../models/Appointment';

interface CreateAppointmentDTO {
  provider: string;
  date: Date;
}

class AppointmentRepository {
  private appointments: Appointment[];

  constructor() {
    this.appointments = [];
  }
  public all(): Appointment[] {
    return this.appointments;
  }

  public findByDate(date: Date): Appointment | null {
    const findDate = this.appointments.find(item => isEqual(date, item.date));

    return findDate || null;
  }

  public create({ provider, date }: CreateAppointmentDTO): Appointment {
    const createAppointment = new Appointment({
      provider,
      date,
    });
    this.appointments.push(createAppointment);

    return createAppointment;
  }
}

export default AppointmentRepository;
