import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import {
  Completable,
  Complete,
  customErrorException,
  Failed,
  Incomplete,
  Result,
  Success,
} from '../../models/.common/result.model';
import { HttpClient } from '@angular/common/http';
import { UserSubscriptionsApiContract } from '../repo/user-subscriptions.repo';
import { UserSubscriptionsModel } from '../../models/user-subscriptions.model';

@Injectable()
export class UserSubscriptionsApi implements UserSubscriptionsApiContract {
  //#region Framework Hooks
  constructor(private httpClient: HttpClient) {}
  //#endregion Framework Hooks

  //#region Public Methods
  public getUserSubscriptions(): Observable<Result<UserSubscriptionsModel[]>> {
    return this.httpClient
      .get(
        'https://fake-frontend-apis.api.quickmocker.com/userSubscriptions',
        {}
      )
      .pipe(
        map(
          (value: any) =>
            new Success<UserSubscriptionsModel[]>(
              (value ?? []).map((x: any) => UserSubscriptionsModel.fromJson(x))
            )
        ),
        catchError((error: customErrorException) =>
          of(new Failed<UserSubscriptionsModel[]>(error))
        )
      );
  }

  public cancelUserSubscription(id: string): Observable<Completable> {
    return this.httpClient
      .post('fake-frontend-apis.api.quickmocker.com/cancelSubscription', id)
      .pipe(
        map((_res: object) => new Complete()),
        catchError((error: Error) => of(new Incomplete(error)))
      );
  }

  //#endregion Public Methods
}
