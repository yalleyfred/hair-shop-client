import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Booking} from '../../models/booking.model';
import {endpoint} from '../../constants/constant';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(public http: HttpClient) {
  }

  public createBooking(Booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(`${endpoint}/booking`, Booking)
  }

  public getAllBooking(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${endpoint}/booking`)
  }

  public getBookingById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${endpoint}/booking/${id}`)
  }

  public updateBooking(Booking: Booking, id: string): Observable<Booking> {
    return this.http.patch<Booking>(`${endpoint}/booking/${id}`, Booking)
  }

  public deleteBooking(id: string): Observable<Booking> {
    return this.http.delete<Booking>(`${endpoint}/booking/${id}`)
  }

}
