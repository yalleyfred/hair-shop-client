export interface MobileMoneyPaymentData {
  amount: number;
  email: string;
  mobile_money: {
    phone: string;
    provider: string; // 'mtn' | 'vodafone' | 'airtel'
  };
  reference?: string;
  callback_url?: string;
}

export interface BankTransferPaymentData {
  amount: number;
  email: string;
  reference?: string;
  callback_url?: string;
}

export interface CardPaymentData {
  amount: number;
  email: string;
  reference?: string;
  callback_url?: string;
}

export interface PaymentResponse {
  status: boolean;
  message: string;
  data: {
    reference: string;
    status: string;
    display_text?: string;
    transaction_id?: number;
    access_code?: string;
    authorization_url?: string;
    transfer_details?: {
      account_number: string;
      account_name: string;
      bank_name: string;
      amount: number;
    };
    // other fields from Paystack response
  };
}
