//#region Events
export enum ForgotPasswordEventName {
  UserForgotPasswordEvent = 'UserForgotPasswordEvent',
}

export abstract class ForgotPasswordEvent {
  abstract name: string;
}

export class UserForgotPasswordEvent implements ForgotPasswordEvent {
  public get name(): ForgotPasswordEventName {
    return ForgotPasswordEventName.UserForgotPasswordEvent;
  }

  constructor(public password: string) {}
}
//#endregion Events
