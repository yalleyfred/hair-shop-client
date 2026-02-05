import {Component, OnInit} from '@angular/core';
import {MatFormField} from '@angular/material/form-field';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatNativeDateModule, MatOption, MatOptgroup} from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {MatSelect} from '@angular/material/select';
import {MatInput, MatInputModule} from '@angular/material/input';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {BookingService} from '../../service/bookings/bookings.service';
import {MatDialogClose} from '@angular/material/dialog';
import {DialogService} from '../../service/dialog/dialog.service';
import {PaymentComponent} from '../../components/payment/payment.component';
import {ServicesService} from '../../service/services/services.service';
import {SalonService, ServiceCategory} from '../../models/service.model';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-booking',
  imports: [
    MatFormField,
    FormsModule,
    MatButton,
    MatOption,
    MatOptgroup,
    MatDatepickerToggle,
    MatDatepicker,
    MatSelect,
    MatDatepickerInput,
    MatInput,
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
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent
],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  public serviceFormGroup: FormGroup;
  public dateTimeFormGroup: FormGroup;
  public detailsFormGroup: FormGroup;

  public services: SalonService[] = [];
  public categories: ServiceCategory[] = [];
  public selectedService: SalonService | null = null;
  public selectedDate: Date = new Date();
  // To set minimum date to tomorrow
  public minDate = new Date();
  public selectedTime: string = '';
  public availableTimes = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'];

  constructor(
    private readonly _formBuilder: FormBuilder,
    public bookingService: BookingService,
    private readonly sideDailogService: DialogService,
    private readonly servicesService: ServicesService
  ) {
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
    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  ngOnInit(): void {
    this.loadServicesAndCategories();
  }

  private loadServicesAndCategories(): void {
    forkJoin([
      this.servicesService.getCategories(),
      this.servicesService.getServices()
    ]).subscribe(([categories, services]) => {
      this.categories = categories;
      this.services = services;
    });
  }

  public selectService(service: SalonService) {
    this.selectedService = service;
    this.serviceFormGroup.get('service')?.setValue(service.id);
  }

  public categoryName(categoryId: string | undefined): string {
    if (!categoryId) {
      return '';
    }
    const match = this.categories.find((c: ServiceCategory) => c.id === categoryId);
    return match?.name || '';
  }

  public confirmBooking() {
    if (this.detailsFormGroup.valid && this.selectedService) {
      return this.bookingService.createBooking({
        serviceType: this.selectedService.name,
        price: this.selectedService.price,
        serviceId: this.selectedService.id,
        appointmentTime: this.dateTimeFormGroup.value.time,
        appointmentDate: this.dateTimeFormGroup.value.date,
        name: this.detailsFormGroup.value.name,
        phone: this.detailsFormGroup.value.phone,
        email: this.detailsFormGroup.value.email,
      }).subscribe((res) => {
        console.log('res', res);
      })
    }
    return '';
  }

  public makePayment() {
    if (!this.selectedService) {
      return;
    }
    const totalWithCharges = Number((this.selectedService.price * 1.01).toFixed(2));
    this.sideDailogService.open(PaymentComponent, {
      data: {
        amount: totalWithCharges,
        email: this.detailsFormGroup.get('email')?.value || '',
        phone: this.detailsFormGroup.get('phone')?.value || ''
      }
    });
  }
}
