import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from 'src/app/core/models/.common/result.model';
import { AuthRepoContract } from '../../bloc/.contracts/repos/auth.repo-contract';
import { AuthResponseModel, LoginByMailData } from '../../models/auth.model';

export abstract class AuthApiContract {
  abstract checkMailExistence(
    mail: string
  ): Observable<Result<AuthResponseModel>>;
  abstract sendOtp(phoneNumber: string): Observable<Result<AuthResponseModel>>;
  abstract loginByMail(
    payload: LoginByMailData
  ): Observable<Result<AuthResponseModel>>;
}

@Injectable()
export class AuthRepo implements AuthRepoContract {
  //#region framework Hooks
  constructor(private AuthApiContract: AuthApiContract) {}
  //#endregion framework Hooks

  //#region Public Methods
  public checkMailExistence(
    mail: string
  ): Observable<Result<AuthResponseModel>> {
    return this.AuthApiContract.checkMailExistence(mail);
  }

  public sendOtp(phoneNumber: string): Observable<Result<AuthResponseModel>> {
    return this.AuthApiContract.sendOtp(phoneNumber);
  }

  public loginByMail(
    payload: LoginByMailData
  ): Observable<Result<AuthResponseModel>> {
    return this.AuthApiContract.loginByMail(payload);
  }
  //#endregion Public Methods
}
