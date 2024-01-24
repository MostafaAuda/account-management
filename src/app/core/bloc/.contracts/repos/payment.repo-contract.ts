import {
  PaymentMethodModel,
  PaymentHistoryModel,
} from '../../../models/payment.model';
import { Completable } from '../../../models/.common/result.model';
import { Observable } from 'rxjs';

export abstract class PaymentRepoContract {
  abstract paymentMethods$: Observable<PaymentMethodModel[]>;
  abstract paymentMethodsSnapshot: PaymentMethodModel[];

  abstract paymentHistory$: Observable<PaymentHistoryModel[]>;
  abstract paymentHistorySnapshot: PaymentHistoryModel[];

  abstract fetchPaymentHistory(): Observable<Completable>;
  abstract removePaymentMethod(
    paymentId: string,
    creationDate: Date
  ): Observable<Completable>;
  abstract fetchPaymentMethods(): Observable<Completable>;
  abstract setDefaultMethod(
    id: string,
    creationDate: Date
  ): Observable<Completable>;
}
