//#region States
export enum SigninStateName {
  CheckLoginTypeState = 'CheckLoginTypeState',
  LoginByMailState = 'LoginByMailState',
  VerifyMailState = 'VerifyMailState',
  LoginByPhoneState = 'LoginByPhoneState',
}

export abstract class SigninState {
  abstract name: string;
}

export class CheckLoginTypeState implements SigninState {
  public get name(): SigninStateName {
    return SigninStateName.CheckLoginTypeState;
  }
}

export class LoginByMailState implements SigninState {
  public get name(): SigninStateName {
    return SigninStateName.LoginByMailState;
  }
}

export class VerifyMailState implements SigninState {
  public get name(): SigninStateName {
    return SigninStateName.VerifyMailState;
  }
}

export class LoginByPhoneState implements SigninState {
  public get name(): SigninStateName {
    return SigninStateName.LoginByPhoneState;
  }
}
//#endregion States

//#region Events
export enum SigninEventName {
  CheckLoginTypeEvent = 'CheckLoginTypeEvent',
  LoginByMailEvent = 'LoginByMailEvent',
  VerifyMailEvent = 'VerifyMailEvent',
  ForgotPasswordEvent = 'ForgotPasswordEvent',
  LoginByPhoneEvent = 'LoginByPhoneEvent',
  ResendOTPEvent = 'ResendOTPEvent',
  BackToVerificationEvent = 'BackToVerificationEvent',
}

export abstract class SigninEvent {
  abstract name: string;
}

export class CheckLoginTypeEvent implements SigninEvent {
  public get name(): SigninEventName {
    return SigninEventName.CheckLoginTypeEvent;
  }
}

export class LoginByMailEvent implements SigninEvent {
  public get name(): SigninEventName {
    return SigninEventName.LoginByMailEvent;
  }

  constructor(public password: string) {}
}

export class VerifyMailEvent implements SigninEvent {
  public get name(): SigninEventName {
    return SigninEventName.VerifyMailEvent;
  }
}

export class ForgotPasswordEvent implements SigninEvent {
  public get name(): SigninEventName {
    return SigninEventName.ForgotPasswordEvent;
  }
}

export class LoginByPhoneEvent implements SigninEvent {
  public get name(): SigninEventName {
    return SigninEventName.LoginByPhoneEvent;
  }

  constructor(public otp: string) {}
}

export class ResendOTPEvent implements SigninEvent {
  public get name(): SigninEventName {
    return SigninEventName.ResendOTPEvent;
  }
}

export class BackToVerificationEvent implements SigninEvent {
  public get name(): SigninEventName {
    return SigninEventName.BackToVerificationEvent;
  }
}
//#endregion Events
