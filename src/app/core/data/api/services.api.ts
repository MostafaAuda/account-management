import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Completable,
  Complete,
  customErrorException,
  Failed,
  Incomplete,
  Result,
  Success,
} from '../../models/.common/result.model';
import { catchError, map } from 'rxjs/operators';
import { ServicesApiContract as ServicesApiContract } from '../repo/services.repo';
import { ServiceModel } from '../../models/service.model';

@Injectable()
export class PlansApi implements ServicesApiContract {
  //#region Framework Hooks
  constructor(private httpClient: HttpClient) {}
  //#endregion Framework Hooks

  //#region Public Methods
  public getServices(): Observable<Result<ServiceModel[]>> {
    return this.httpClient
      .get('https://fake-frontend-apis.api.quickmocker.com/plans', {})
      .pipe(
        map(
          (value: any) =>
            new Success<ServiceModel[]>(
              (value ?? []).map((x: any) => ServiceModel.fromJson(x))
            )
        ),
        catchError((error: customErrorException) =>
          of(new Failed<ServiceModel[]>(error))
        )
      );
  }

  public subscribeBundle(_id: string, _name: string): Observable<Completable> {
    return this.httpClient
      .post(
        `https://fake-frontend-apis.api.quickmocker.com/subscribeBundle/${_id}&${_name}`,
        {}
      )
      .pipe(
        map((_response: object) => new Complete()),
        catchError((error: Error) => of(new Incomplete(error)))
      );
  }

  public unsubscribeBundle(
    _id: string,
    _name: string
  ): Observable<Completable> {
    return this.httpClient
      .post(
        `https://fake-frontend-apis.api.quickmocker.com/unsubscribeBundle/${_id}&${_name}`,
        {}
      )
      .pipe(
        map((_response: object) => new Complete()),
        catchError((error: Error) => of(new Incomplete(error)))
      );
  }

  public getPlansByType(_type: string): Observable<Result<ServiceModel[]>> {
    return this.httpClient
      .get(
        `https://fake-frontend-apis.api.quickmocker.com/getPlanByType/` + _type,
        {}
      )
      .pipe(
        map(
          (value: any) =>
            new Success<ServiceModel[]>(
              (value ?? []).map((x: any) => ServiceModel.fromJson(x))
            )
        ),
        catchError((error: customErrorException) =>
          of(new Failed<ServiceModel[]>(error))
        )
      );
  }
  //#endregion Public Methods
}
