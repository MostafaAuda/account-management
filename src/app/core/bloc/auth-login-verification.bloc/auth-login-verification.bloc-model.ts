import { AuthEntryData } from '../.contracts/services/auth.service-contract';

//#region Events
export enum LoginVerificationEventName {
  LoginEvent = 'LoginEvent',
}

export abstract class LoginVerificationEvent {
  abstract name: string;
}

export class LoginEvent implements LoginVerificationEvent {
  public get name(): LoginVerificationEventName {
    return LoginVerificationEventName.LoginEvent;
  }

  constructor(public AuthEntryData: AuthEntryData) {}
}
//#endregion Events
