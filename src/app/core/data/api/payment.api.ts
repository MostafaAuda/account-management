import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { PaymentApiContract } from '../repo/payment.repo';
import {
  PaymentHistoryModel,
  PaymentMethodModel,
} from '../../models/payment.model';
import {
  Completable,
  Complete,
  customErrorException,
  Failed,
  Incomplete,
  Result,
  Success,
} from '../../models/.common/result.model';

@Injectable()
export class PaymentApi implements PaymentApiContract {
  //#region Framwork hooks
  constructor(private httpClient: HttpClient) {}
  //#endregion Framwork hooks

  //#region Public Methods
  public getSavedPaymentMethods(): Observable<Result<PaymentMethodModel[]>> {
    return this.httpClient
      .get('https://accountmanagement.api.quickmocker.com/api/v1/user/payment')
      .pipe(
        map(
          (value: any) =>
            new Success<PaymentMethodModel[]>(
              (value?.data ?? []).map((x: any) => {
                return PaymentMethodModel.fromJson(x);
              })
            )
        ),
        catchError((error: customErrorException) =>
          of(new Failed<PaymentMethodModel[]>(error))
        )
      );
  }

  public removePaymentMethods(
    paymentId: string,
    creationDate: Date
  ): Observable<Completable> {
    return this.httpClient
      .delete(
        `https://accountmanagement.api.quickmocker.com/api/v1/user/payment/${paymentId}&${creationDate}`
      )
      .pipe(
        map((_response: object) => new Complete()),
        catchError((error: Error) => of(new Incomplete(error)))
      );
  }

  public setPaymentMethods(
    id: string,
    creationDate: Date
  ): Observable<Completable> {
    return this.httpClient
      .put(
        `https://accountmanagement.api.quickmocker.com/api/v1/user/payment/${id}&${creationDate}`,
        {}
      )
      .pipe(
        map((_response: object) => new Complete()),
        catchError((error: Error) => of(new Incomplete(error)))
      );
  }

  public getPaymentHistory(): Observable<Result<PaymentHistoryModel[]>> {
    return this.httpClient
      .get(
        'https://accountmanagement.api.quickmocker.com/api/v1/user/paymentHistory'
      )
      .pipe(
        map(
          (value: any) =>
            new Success<PaymentHistoryModel[]>(
              (value?.data ?? []).map((x: any) => {
                return PaymentHistoryModel.fromJson(x);
              })
            )
        ),
        catchError((error: customErrorException) =>
          of(new Failed<PaymentHistoryModel[]>(error))
        )
      );
  }
  //#endregion Public Methods
}
