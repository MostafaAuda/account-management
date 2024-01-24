//#region Events
export enum SignupEventName {
  UserSignupEvent = 'UserSignupEvent',
  BackToVerificationEvent = 'BackToVerificationEvent',
}

export abstract class SignupEvent {
  abstract name: string;
}

export class UserSignupEvent implements SignupEvent {
  public get name(): SignupEventName {
    return SignupEventName.UserSignupEvent;
  }

  constructor(public password: string) {}
}

export class BackToVerificationEvent implements SignupEvent {
  public get name(): SignupEventName {
    return SignupEventName.BackToVerificationEvent;
  }
}
//#endregion Events
