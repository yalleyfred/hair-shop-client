import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {io, Socket} from 'socket.io-client';
import {endpoint} from '../../constants/constant';
import {BankTransferPaymentData, CardPaymentData, MobileMoneyPaymentData, PaymentResponse} from '../../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly apiUrl = `${endpoint}/payments`;

  constructor(private readonly http: HttpClient) {
  }

  public initiateMomoPayment(paymentData: MobileMoneyPaymentData): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/mobile-money`, paymentData);
  }

  public initiateBankTransfer(paymentData: BankTransferPaymentData): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/bank-transfer`, paymentData);
  }

  public initiateCardPayment(paymentData: CardPaymentData): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/card-payment`, paymentData);
  }

  public submitMomoOtp(payload: { reference: string; otp: string }): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/mobile-money/otp`, payload);
  }

  public verifyPayment(reference: string): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiUrl}/verify/${reference}`);
  }

  public getTransactionStatus(id: number): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiUrl}/transaction/${id}`);
  }

  public connectPaymentSocket(): Socket {
    return io(`${endpoint}/payments`, {transports: ['websocket']});
  }
}
