import { Observable } from 'rxjs';
import { Result } from 'src/app/core/models/.common/result.model';
import {
  AuthResponseModel,
  LoginByMailData,
} from 'src/app/core/models/auth.model';

export abstract class AuthRepoContract {
  abstract checkMailExistence(
    mail: string
  ): Observable<Result<AuthResponseModel>>;
  abstract sendOtp(phoneNumber: string): Observable<Result<AuthResponseModel>>;
  abstract loginByMail(
    payload: LoginByMailData
  ): Observable<Result<AuthResponseModel>>;
}
