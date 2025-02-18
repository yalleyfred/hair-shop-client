import {Component} from '@angular/core';
import {MatFormField} from '@angular/material/form-field';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatNativeDateModule, MatOption, MatRipple} from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {MatSelect} from '@angular/material/select';
import {MatInput, MatInputModule} from '@angular/material/input';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatList, MatListItem} from '@angular/material/list';
import {RouterLink} from '@angular/router';
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';

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
    RouterLink,
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
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {
  public serviceFormGroup: FormGroup;
  public dateTimeFormGroup: FormGroup;
  public detailsFormGroup: FormGroup;

  public services = [
    {name: 'Haircut', price: 30},
    {name: 'Coloring', price: 60},
    {name: 'Styling', price: 40},
  ];
  public selectedService: any;
  public selectedDate: Date = new Date();
  public selectedTime: string = '';
  public availableTimes = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'];

  constructor(private _formBuilder: FormBuilder) {
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

  public selectService(service: any) {
    this.selectedService = service;
    this.serviceFormGroup.get('service')?.setValue(service.name);
  }

  public confirmBooking() {
    if (this.detailsFormGroup.valid) {
      console.log('Booking Confirmed:', {
        service: this.selectedService,
        date: this.dateTimeFormGroup.value.date,
        time: this.dateTimeFormGroup.value.time,
        name: this.detailsFormGroup.value.name,
        phone: this.detailsFormGroup.value.phone,
        email: this.detailsFormGroup.value.email,
      });
    }
  }
}
