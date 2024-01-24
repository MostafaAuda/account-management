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
import { UserApiContract } from '../repo/user.repo';
import { UserChangePassword, UserInfo } from 'src/app/core/models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UpdateInfoApi implements UserApiContract {
  //#region Framework Hooks
  constructor(private httpClient: HttpClient) {}
  //#endregion Framework Hooks

  //#region Public Methods
  public getUserInfo(): Observable<Result<UserInfo>> {
    return this.httpClient
      .get('https://fake-frontend-apis.api.quickmocker.com/userInfo', {})
      .pipe(
        map((value) => new Success(UserInfo.fromJson(value))),
        catchError((error: customErrorException) =>
          of(new Failed<UserInfo>(error))
        )
      );
  }

  public setUserInfo(payload: UserInfo): Observable<Completable> {
    return this.httpClient.post<UserInfo>('url', payload).pipe(
      map((_res: object) => new Complete()),
      catchError((error: Error) => of(new Incomplete(error)))
    );
  }

  public setNewPassword(data: UserChangePassword): Observable<Completable> {
    let payload = data;
    return this.httpClient.post<UserChangePassword>('url', payload).pipe(
      map((_res: object) => new Complete()),
      catchError((error: Error) => of(new Incomplete(error)))
    );
  }
  //#endregion Public Methods
}
