import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import {
  customErrorException,
  Failed,
  Result,
  Success,
} from '../../models/.common/result.model';
import { HttpClient } from '@angular/common/http';
import { AuthResponseModel, LoginByMailData } from '../../models/auth.model';
import { AuthApiContract } from '../repo/auth.repo';

@Injectable()
export class AuthApi implements AuthApiContract {
  //#region Framework Hooks
  constructor(private httpClient: HttpClient) {}
  //#endregion Framework Hooks

  //#region Public Methods
  public checkMailExistence(
    mail: string
  ): Observable<Result<AuthResponseModel>> {
    return this.httpClient
      .post<string>(
        'https://fake-frontend-apis.api.quickmocker.com/checkmailexistence',
        mail
      )
      .pipe(
        map((value) => new Success(AuthResponseModel.fromJson(value))),
        catchError((error: customErrorException) =>
          of(new Failed<AuthResponseModel>(error))
        )
      );
  }

  public sendOtp(phoneNumber: string): Observable<Result<AuthResponseModel>> {
    let payload = {
      phoneNumber: phoneNumber,
    };

    return this.httpClient
      .post<any>(
        'https://fake-frontend-apis.api.quickmocker.com/sendOtp',
        payload
      )
      .pipe(
        map((value) => new Success(AuthResponseModel.fromJson(value))),
        catchError((error: customErrorException) =>
          of(new Failed<AuthResponseModel>(error))
        )
      );
  }

  public loginByMail(
    payload: LoginByMailData
  ): Observable<Result<AuthResponseModel>> {
    console.log(payload);

    return this.httpClient
      .post<LoginByMailData>(
        'https://fake-frontend-apis.api.quickmocker.com/loginByMail',
        ''
      )
      .pipe(
        map((value) => new Success(AuthResponseModel.fromJson(value))),
        catchError((error: customErrorException) =>
          of(new Failed<AuthResponseModel>(error))
        )
      );
  }
  //#endregion Public Methods
}
