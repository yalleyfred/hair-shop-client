export interface Booking {
  serviceType: string;
  price: number;
  appointmentDate: Date;
  appointmentTime: string;
  name: string;
  email: string;
  phone: string;
  serviceId?: string;
}

export interface BookingResponse extends Booking {
  id: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}
