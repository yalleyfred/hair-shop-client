export enum ServiceTypeEnum {
  twisting = 'twisting'
}

export interface Booking {
  serviceType: ServiceTypeEnum;
  price: number;
  appointmentDate: Date;
  appointmentTime: string;
  name: string;
  email: string;
  phone: string;
}

export type ServiceType = {
  name: ServiceTypeEnum;
  price: number
}

export interface BookingResponse extends Booking {
  id: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}
