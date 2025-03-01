import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatFormField} from '@angular/material/form-field';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatNativeDateModule, MatOption} from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {MatSelect} from '@angular/material/select';
import {MatInput, MatInputModule} from '@angular/material/input';
import {CurrencyPipe, DatePipe, NgForOf} from '@angular/common';
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import {BookingService} from '../../service/bookings/bookings.service';
import {ServiceType, ServiceTypeEnum} from '../../models/booking.model';
import {MatDialogClose} from '@angular/material/dialog';

@Component({
  selector: 'app-booking',
  imports: [
    MatFormField,
    FormsModule,
    MatButton,
    MatOption,
    MatDatepickerToggle,
    MatDatepicker,
    MatSelect,
    MatDatepickerInput,
    MatInput,
    NgForOf,
    CurrencyPipe,
    DatePipe,
    MatStep,
    ReactiveFormsModule,
    MatStepLabel,
    MatStepperNext,
    MatStepper,
    MatStepperPrevious,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatDialogClose,
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit, OnDestroy {
  public serviceFormGroup: FormGroup;
  public dateTimeFormGroup: FormGroup;
  public detailsFormGroup: FormGroup;

  public services: ServiceType[] = [
    {name: ServiceTypeEnum.twisting, price: 30},
    // {name: 'Coloring', price: 60},
    // {name: 'Styling', price: 40},
  ];
  public selectedService: any;
  public selectedDate: Date = new Date();
  public selectedTime: string = '';
  public availableTimes = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'];

  constructor(private _formBuilder: FormBuilder, public bookingService: BookingService) {
    this.serviceFormGroup = this._formBuilder.group({
      service: ['', Validators.required],
    });
    this.dateTimeFormGroup = this._formBuilder.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
    });
    this.detailsFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  public ngOnInit() {

  }

  public ngOnDestroy() {
  }

  public selectService(service: any) {
    this.selectedService = service;
    this.serviceFormGroup.get('service')?.setValue(service.name);
  }

  public confirmBooking() {
    if (this.detailsFormGroup.valid) {
      return this.bookingService.createBooking({
        serviceType: this.selectedService.name,
        price: this.selectedService.price,
        appointmentTime: this.dateTimeFormGroup.value.time,
        appointmentDate: this.dateTimeFormGroup.value.date,
        name: this.detailsFormGroup.value.name,
        phone: this.detailsFormGroup.value.phone,
        email: this.detailsFormGroup.value.email,
      })
    }
    return '';
  }
}
