import { BehaviorSubject, Observable } from 'rxjs';
import { AuthResponseModel } from 'src/app/core/models/auth.model';

export interface AuthEntryData {
  entryID: string | number;
  entryType: EntryType;
}

export enum EntryType {
  email = 'MAIL_LOGIN',
  phone = 'PHONE_LOGIN',
}

export abstract class AuthenticationServiceContract {
  abstract isUserSubmittingStream: BehaviorSubject<boolean>;
  abstract isUserSubmitting$: Observable<boolean>;

  abstract authEntryDataStream: BehaviorSubject<AuthEntryData>;
  abstract authEntryData$: Observable<AuthEntryData>;
  abstract authEntryDataSnapshot: AuthEntryData;

  abstract formErrorStream: BehaviorSubject<string>;
  abstract formErrorData$: Observable<string>;

  abstract otpErrorStream: BehaviorSubject<string>;
  abstract otpErrorData$: Observable<string>;

  abstract isUserLoggedStream: BehaviorSubject<boolean>;
  abstract isUserLogged$: Observable<boolean>;

  abstract resetUserEntryData(): void;
  abstract authenticateUser(data: AuthResponseModel): void;
  abstract revokeAuthentication(): void;
}
