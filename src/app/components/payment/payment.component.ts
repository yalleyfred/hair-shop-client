import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Socket} from 'socket.io-client';
import {
  MobileMoneyPaymentData,
  BankTransferPaymentData,
  CardPaymentData
} from '../../models/payment.model';
import {Router} from '@angular/router';
import {PaymentService} from '../../service/payment/payment.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  imports: [
    ReactiveFormsModule
],
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnDestroy {
  paymentForm: FormGroup = new FormGroup({});
  loading = false;
  error: string | null = null;
  success = false;
  selectedPaymentMethod = 'mobile-money'; // Default payment method
  bankTransferDetails: any = null;
  redirectUrl: string | null = null;
  pendingReference: string | null = null;
  pendingMessage = '';
  otpRequired = false;
  verifying = false;
  private socket?: Socket;
  private pollingIntervalId: any;
  private pollingTimeoutId: any;

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
    protected readonly router: Router,
    @Inject(MAT_DIALOG_DATA) private readonly dialogData: { amount?: number; email?: string; phone?: string } | null
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.prefillFromDialog();
  }

  ngOnDestroy(): void {
    this.stopRealtime();
  }

  public createForm(): void {
    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.1)]],
      email: ['', [Validators.required, Validators.email]],
      paymentMethod: [this.selectedPaymentMethod, Validators.required],
      // Mobile Money specific fields
      phone: ['', [Validators.pattern(/^(0\d{9}|233\d{9})$/)]],
      provider: ['mtn'],
      otp: ['']
    });

    // Add conditional validators based on payment method
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      this.selectedPaymentMethod = method;

      if (method === 'mobile-money') {
        this.paymentForm.get('phone')?.setValidators([Validators.required, Validators.pattern(/^(0\d{9}|233\d{9})$/)]);
        this.paymentForm.get('provider')?.setValidators([Validators.required]);
      } else {
        this.paymentForm.get('phone')?.clearValidators();
        this.paymentForm.get('provider')?.clearValidators();
        this.paymentForm.get('phone')?.setValue('');
        this.paymentForm.get('provider')?.setValue('mtn');
      }

      this.paymentForm.get('phone')?.updateValueAndValidity();
      this.paymentForm.get('provider')?.updateValueAndValidity();
    });
  }

  private prefillFromDialog(): void {
    const baseAmount = this.dialogData?.amount;
    const email = this.dialogData?.email;
    const phone = this.dialogData?.phone;
    if (baseAmount !== undefined && baseAmount !== null) {
      const total = Number((baseAmount).toFixed(2));
      this.paymentForm.get('amount')?.setValue(total);
    }
    if (email) {
      this.paymentForm.get('email')?.setValue(email);
    }
    if (phone) {
      this.paymentForm.get('phone')?.setValue(phone);
    }
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
    this.success = false;
    this.pendingReference = null;
    this.pendingMessage = '';
    this.otpRequired = false;
    this.verifying = false;
    this.paymentForm.get('otp')?.setValue('');
    this.paymentForm.get('otp')?.clearValidators();
    this.paymentForm.get('otp')?.updateValueAndValidity({emitEvent: false});
    this.stopRealtime();

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
        const data = response?.data ?? {};
        const reference = data.reference;
        const status = (data.status || '').toLowerCase();
        const requiresOtp = data?.requires_otp === true || status === 'otp' || status === 'requires_otp';
        const instructions = data.display_text || response?.message || 'Check your phone to approve the payment.';

        if (!response?.status && !reference) {
          this.error = response?.message || 'Unable to start mobile money payment.';
          return;
        }

        if (reference) {
          localStorage.setItem('payment_reference', reference);
          this.pendingReference = reference;
          this.pendingMessage = instructions;
        }

        if (status === 'success') {
          this.success = true;
          this.pendingReference = null;
          this.otpRequired = false;
          this.stopRealtime();
          return;
        }

        if (['pending', 'otp', 'requires_otp', 'processing'].includes(status) || response?.status === true) {
          this.otpRequired = requiresOtp;
          const otpControl = this.paymentForm.get('otp');
          if (this.otpRequired) {
            otpControl?.setValidators([Validators.required, Validators.pattern(/^\d{4,6}$/)]);
          } else {
            otpControl?.clearValidators();
            this.startTracking(reference);
          }
          otpControl?.updateValueAndValidity({emitEvent: false});
          return;
        }

        this.error = response?.message || 'Unable to start mobile money payment.';
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

  public submitOtp(): void {
    if (!this.pendingReference) {
      this.error = 'No pending payment to verify.';
      return;
    }

    const otpControl = this.paymentForm.get('otp');
    otpControl?.markAsTouched();
    if (otpControl?.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.paymentService.submitMomoOtp({
      reference: this.pendingReference,
      otp: otpControl?.value
    }).subscribe({
      next: (response: any) => {
        this.loading = false;
        const status = (response.data?.status || '').toLowerCase();

        if (status === 'failed') {
          this.error = response.message || 'OTP verification failed.';
          return;
        }

        this.pendingMessage = response.data?.display_text || 'OTP submitted. Verifying payment...';
        this.otpRequired = false;
        this.startTracking(this.pendingReference as string);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to verify OTP. Please try again.';
      }
    });
  }

  private startTracking(reference: string): void {
    // Use Socket.IO push but always run polling in parallel as a safety net
    try {
      this.startSocket(reference);
    } catch (e) {
      console.error('Socket setup failed; falling back to polling', e);
    }
    this.startPolling(reference);
  }

  private startSocket(reference: string): void {
    this.stopRealtime();
    this.verifying = true;
    this.socket = this.paymentService.connectPaymentSocket();
    this.socket.emit('join', {reference});

    const handleStatus = (payload: any) => {
      const rawStatus = payload?.status;
      const dataStatus = payload?.data?.status;
      const status = typeof rawStatus === 'string'
        ? rawStatus.toLowerCase()
        : typeof dataStatus === 'string'
          ? dataStatus.toLowerCase()
          : '';
      const message = payload?.message || payload?.data?.display_text;
      const requiresOtp = payload?.data?.requires_otp === true || status === 'otp' || status === 'requires_otp';
      const isSuccess = status === 'success' || rawStatus === true;
      const isFail = ['failed', 'cancelled'].includes(status);

      if (isSuccess) {
        this.success = true;
        this.pendingReference = null;
        this.otpRequired = false;
        this.verifying = false;
        this.stopRealtime();
      } else if (isFail) {
        this.error = message || 'Payment failed.';
        this.pendingReference = null;
        this.otpRequired = false;
        this.verifying = false;
        this.stopRealtime();
      } else if (requiresOtp) {
        this.otpRequired = true;
        this.pendingMessage = message || 'Enter the OTP sent to your phone.';
      } else if (status) {
        this.otpRequired = false;
        this.pendingMessage = message || 'Awaiting confirmation...';
      }
    };

    this.socket.on('payment_status', handleStatus);
    this.socket.on('connect_error', () => {
      this.stopRealtime();
      this.startPolling(reference);
    });
    this.socket.on('disconnect', () => {
      if (!this.success && !this.error) {
        this.stopRealtime();
        this.startPolling(reference);
      }
    });
  }

  private startPolling(reference: string): void {
    this.stopPolling();
    this.verifying = true;

    this.pendingReference = reference;
    if (!this.pendingMessage) {
      this.pendingMessage = 'Check your phone to approve the payment. We will confirm automatically.';
    }

    this.pollingIntervalId = setInterval(() => {
      this.paymentService.verifyPayment(reference).subscribe({
        next: (response: any) => {
          const status = (response.data?.status || '').toLowerCase();
          const isSuccess = status === 'success' || (response?.status === true && !status);
          const isFail = ['failed', 'cancelled'].includes(status);

          if (isSuccess) {
            this.success = true;
            this.pendingReference = null;
            this.otpRequired = false;
            this.verifying = false;
            this.stopPolling();
          } else if (isFail) {
            this.error = 'Payment was not completed successfully.';
            this.pendingReference = null;
            this.otpRequired = false;
            this.verifying = false;
            this.stopPolling();
          } else {
            this.pendingMessage = response.data?.display_text || 'Awaiting confirmation on your phone...';
          }
        },
        error: () => {
          this.error = 'Could not verify payment status.';
          this.pendingReference = null;
          this.verifying = false;
          this.stopPolling();
        }
      });
    }, 4000);

    // Stop checking after 2 minutes (30 checks)
    this.pollingTimeoutId = setTimeout(() => {
      this.pendingReference = null;
      this.verifying = false;
      this.stopPolling();
      if (!this.success && !this.error) {
        this.error = 'Payment verification timed out. Please try again.';
      }
    }, 120000);
  }

  private stopPolling(): void {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
      this.pollingIntervalId = null;
    }
    if (this.pollingTimeoutId) {
      clearTimeout(this.pollingTimeoutId);
      this.pollingTimeoutId = null;
    }
    this.verifying = false;
  }

  private stopRealtime(): void {
    this.stopPolling();
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = undefined;
    }
    this.verifying = false;
  }
}
