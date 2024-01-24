import {
  PaymentHistoryModel,
  PaymentMethodModel,
} from '../../models/payment.model';
import {
  Completable,
  Complete,
  Incomplete,
  Result,
} from '../../models/.common/result.model';
import { PaymentRepoContract } from '../../bloc/.contracts/repos/payment.repo-contract';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

export abstract class PaymentApiContract {
  abstract getSavedPaymentMethods(): Observable<Result<PaymentMethodModel[]>>;
  abstract removePaymentMethods(
    paymentId: string,
    creationDate: Date
  ): Observable<Completable>;
  abstract getPaymentHistory(): Observable<Result<PaymentHistoryModel[]>>;
  abstract setPaymentMethods(
    id: string,
    creationDate: Date
  ): Observable<Completable>;
}

@Injectable()
export class PaymentRepo implements PaymentRepoContract {
  //#region Private data members
  private paymentHistoryStream = new BehaviorSubject<PaymentHistoryModel[]>([]);
  private paymentMethodsStream = new BehaviorSubject<PaymentMethodModel[]>([]);
  //#endregion Private data members

  //#region Public data members
  public get paymentHistory$(): Observable<PaymentHistoryModel[]> {
    return this.paymentHistoryStream.asObservable();
  }

  public get paymentHistorySnapshot(): PaymentHistoryModel[] {
    return this.paymentHistoryStream.value;
  }

  public get paymentMethods$(): Observable<PaymentMethodModel[]> {
    return this.paymentMethodsStream.asObservable();
  }

  public get paymentMethodsSnapshot(): PaymentMethodModel[] {
    return this.paymentMethodsStream.value;
  }
  //#endregion Public data members

  //#region Framwork hooks
  constructor(private paymentApi: PaymentApiContract) {}
  //#endregion Framwork hooks

  //#region Public Methods
  public fetchPaymentHistory(): Observable<Completable> {
    //?HINT: Invalidating cache with pre loading placeholders
    this.paymentHistoryStream.next([]);

    return this.paymentApi.getPaymentHistory().pipe(
      map((responseResult: Result<PaymentHistoryModel[]>) =>
        responseResult.either(
          (paymentHistory: PaymentHistoryModel[]) => {
            this.paymentHistoryStream.next(paymentHistory);
            return new Complete();
          },
          (error: Error) => new Incomplete(error)
        )
      )
    );
  }

  public removePaymentMethod(
    paymentId: string,
    creationDate: Date
  ): Observable<Completable> {
    return this.paymentApi.removePaymentMethods(paymentId, creationDate).pipe(
      map((responseResult: Completable) =>
        responseResult.either(
          () => {
            this.paymentMethodsStream.next(
              //Remove the item locally
              this.paymentMethodsSnapshot.filter(
                (x) => x.paymentId !== paymentId
              )
            );
            return new Complete();
          },
          (error: Error) => new Incomplete(error)
        )
      )
    );
  }

  public fetchPaymentMethods(): Observable<Completable> {
    //?HINT: Invalidating cache with pre loading placeholders
    this.paymentMethodsStream.next([]);

    return this.paymentApi.getSavedPaymentMethods().pipe(
      map((responseResult: Result<PaymentMethodModel[]>) =>
        responseResult.either(
          (savedPaymentMethods: PaymentMethodModel[]) => {
            this.paymentMethodsStream.next(savedPaymentMethods);
            return new Complete();
          },
          (error: Error) => new Incomplete(error)
        )
      )
    );
  }

  public setDefaultMethod(
    id: string,
    creationDate: Date
  ): Observable<Completable> {
    return this.paymentApi.setPaymentMethods(id, creationDate).pipe(
      map((responseResult: Completable) =>
        responseResult.either(
          () => {
            this.paymentMethodsStream.next(this.paymentMethodsSnapshot);
            return new Complete();
          },
          (error: Error) => new Incomplete(error)
        )
      )
    );
  }
  //#endregion Public Methods
}
