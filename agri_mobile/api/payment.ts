import { ApiResponse, PaymentRequest} from '@/types';
import { client } from './client';

class PaymentService {
  async makePayment(data: PaymentRequest): Promise<ApiResponse<PaymentResponse>> {
    return await client.post<PaymentResponse>('/payment', data);
  }

  // async getPayments(): Promise<ApiResponse<>> {
  //   return await client.get<PaymentResponse[]>('/payment');
  // }
}

export const paymentService = new PaymentService();
