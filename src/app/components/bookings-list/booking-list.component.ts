import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Booking, BookingResponse} from '../../models/booking.model';
import {BookingService} from '../../service/bookings/bookings.service';
import {filter, Observable, Subscription} from 'rxjs';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {AsyncPipe, DatePipe} from '@angular/common';
import {MatDialogClose} from '@angular/material/dialog';
import {MatSlideToggle} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-Booking-list',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatIcon,
    MatIconButton,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderRow,
    MatRow,
    MatDialogClose,
    MatButton,
    DatePipe,
  ],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.css'
})
export class BookingListComponent {

  public displayedColumns: string[] = ['id', 'name', 'serviceType', 'bookingDate', 'bookingTime', 'price', 'actions'];
  public bookings: BookingResponse[] = [];
  public bookingStatus = false;

  public subscription = new Subscription();

  constructor(private readonly bookingService: BookingService) {
    this.bookingService.getAllBooking().subscribe(bookings => this.bookings = bookings);
  }

  // public editBooking(booking: Booking) {
  //   // Logic to edit a booking
  //   console.log('Edit booking:', booking);
  // }

  public deleteBooking(booking: BookingResponse) {
    this.bookingService.deleteBooking(booking, booking.id).subscribe((res: BookingResponse) => {
      this.bookings = this.bookings.filter((data: BookingResponse) => data.id !== res.id)
    })
  }

}
