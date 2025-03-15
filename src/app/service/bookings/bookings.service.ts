import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Booking, BookingResponse} from '../../models/booking.model';
import {endpoint} from '../../constants/constant';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(public http: HttpClient) {
  }

  public createBooking(booking: Booking): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${endpoint}/booking`, booking)
  }

  public getAllBooking(): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(`${endpoint}/booking`)
  }

  public getBookingById(id: string): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${endpoint}/booking/${id}`)
  }

  public updateBooking(booking: Booking, id: string): Observable<BookingResponse> {
    return this.http.patch<BookingResponse>(`${endpoint}/booking/${id}`, booking)
  }

  public deleteBooking(booking: Booking, id: string) {
    return this.http.delete<BookingResponse>(`${endpoint}/booking/${id}`, {body: booking})
  }

}
