import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MobileMoneyPaymentData,
  BankTransferPaymentData,
  CardPaymentData
} from '../../models/payment.model';
import {Router} from '@angular/router';
import {PaymentService} from '../../service/payment/payment.service';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  imports: [
    ReactiveFormsModule
],
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup = new FormGroup({});
  loading = false;
  error: string | null = null;
  success = false;
  selectedPaymentMethod = 'mobile-money'; // Default payment method
  bankTransferDetails: any = null;
  redirectUrl: string | null = null;

  momoProviders = [
    {value: 'mtn', label: 'MTN Mobile Money'},
    {value: 'vodafone', label: 'Vodafone Cash'},
    {value: 'airtel', label: 'AirtelTigo Money'}
  ];

  paymentMethods = [
    {value: 'mobile-money', label: 'Mobile Money'},
    {value: 'bank-transfer', label: 'Bank Transfer'},
    {value: 'card', label: 'Debit/Credit Card'}
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly paymentService: PaymentService,
    protected readonly router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  public createForm(): void {
    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      paymentMethod: [this.selectedPaymentMethod, Validators.required],
      // Mobile Money specific fields
      phone: ['', [Validators.pattern(/^0\d{9}$/)]],
      provider: ['mtn']
    });

    // Add conditional validators based on payment method
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      this.selectedPaymentMethod = method;

      if (method === 'mobile-money') {
        this.paymentForm.get('phone')?.setValidators([Validators.required, Validators.pattern(/^0\d{9}$/)]);
        this.paymentForm.get('provider')?.setValidators([Validators.required]);
      } else {
        this.paymentForm.get('phone')?.clearValidators();
        this.paymentForm.get('provider')?.clearValidators();
      }

      this.paymentForm.get('phone')?.updateValueAndValidity();
      this.paymentForm.get('provider')?.updateValueAndValidity();
    });
  }

  public onSubmit(): void {
    if (this.paymentForm.invalid) {
      // Mark all fields as touched to show errors
      Object.keys(this.paymentForm.controls).forEach(key => {
        this.paymentForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = null;
    this.bankTransferDetails = null;
    this.redirectUrl = null;

    const formValues = this.paymentForm.value;
    const method = formValues.paymentMethod;

    const commonPaymentData = {
      amount: formValues.amount,
      email: formValues.email,
      callback_url: `${window.location.origin}/payment/callback`
    };

    switch (method) {
      case 'mobile-money':
        this.processMomoPayment({
          ...commonPaymentData,
          mobile_money: {
            phone: formValues.phone,
            provider: formValues.provider
          }
        });
        break;
      case 'bank-transfer':
        this.processBankTransfer(commonPaymentData);
        break;
      case 'card':
        this.processCardPayment(commonPaymentData);
        break;
    }
  }

  public processMomoPayment(paymentData: MobileMoneyPaymentData): void {
    this.paymentService.initiateMomoPayment(paymentData).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.status) {
          // Some providers might require additional user action
          if (response.data.display_text) {
            alert(`Follow these instructions: ${response.data.display_text}`);
          }

          // Store the reference for verification
          localStorage.setItem('payment_reference', response.data.reference);

          if (response.data.status === 'success') {
            this.success = true;
          } else {
            // For pending transactions, we'll check status later
            this.checkPaymentStatus(response.data.reference);
          }
        } else {
          console.log('response', response);
          this.error = response.message;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Payment failed. Please try again.';
      }
    });
  }

  public processBankTransfer(paymentData: BankTransferPaymentData): void {
    this.paymentService.initiateBankTransfer(paymentData).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.status) {
          // Store the reference for verification
          localStorage.setItem('payment_reference', response.data.reference);

          // For bank transfers, we show the transfer details
          if (response.data.transfer_details) {
            this.bankTransferDetails = response.data.transfer_details;
          } else if (response.data.authorization_url) {
            // Some integrations redirect to a payment page
            this.redirectUrl = response.data.authorization_url;
            // @ts-ignore
            window.location.href = this.redirectUrl;
          }
        } else {
          this.error = response.message;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Payment failed. Please try again.';
      }
    });
  }

  public processCardPayment(paymentData: CardPaymentData): void {
    this.paymentService.initiateCardPayment(paymentData).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.status) {
          // Store the reference for verification
          localStorage.setItem('payment_reference', response.data.reference);

          // For card payments, we redirect to the authorization URL
          if (response.data.authorization_url) {
            this.redirectUrl = response.data.authorization_url;
            // @ts-ignore
            window.location.href = this.redirectUrl;
          }
        } else {
          this.error = response.message;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Payment failed. Please try again.';
      }
    });
  }

  private checkPaymentStatus(reference: string): void {
    // Poll for payment status, typically done on a callback page
    const interval = setInterval(() => {
      this.paymentService.verifyPayment(reference).subscribe({
        next: (response: any) => {
          if (response.data.status === 'success') {
            clearInterval(interval);
            this.success = true;
            // Navigate to success page or show success message
          } else if (['failed', 'cancelled'].includes(response.data.status)) {
            clearInterval(interval);
            this.error = 'Payment was not completed successfully.';
          }
          // Continue polling for pending status
        },
        error: () => {
          clearInterval(interval);
          this.error = 'Could not verify payment status.';
        }
      });
    }, 5000); // Check every 5 seconds

    // Stop checking after 2 minutes (24 checks)
    setTimeout(() => {
      clearInterval(interval);
      if (!this.success && !this.error) {
        this.error = 'Payment verification timed out. Please contact support.';
      }
    }, 120000);
  }
}
