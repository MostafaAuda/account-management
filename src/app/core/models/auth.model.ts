export class TokenModel {
  constructor(
    public token: string,
    public refreshToken: string,
    public loginType: 'MAIL_LOGIN' | 'PHONE_LOGIN',
    public firstTimeLogin: boolean,
    public email?: string,
    public phone?: string
  ) {}

  public static fromJson(payload: any): TokenModel {
    return new TokenModel(
      payload.email,
      payload.phone,
      payload.token,
      payload.refreshToken,
      payload.loginType,
      payload.firstTimeLogin
    );
  }
}

export class AuthResponseModel {
  constructor(
    public success: boolean,
    public fault: {
      baseCode: number;
      code: number;
      message: string;
      meta: any;
      innerFault: any;
    } | null,
    public warning: any,
    public data: TokenModel,
    public twistStatusCode: number,
    public httpStatusCode: string
  ) {}

  public static fromJson(payload: any): AuthResponseModel {
    return new AuthResponseModel(
      payload.success,
      payload.fault,
      payload.warning,
      payload.data,
      payload.twistStatusCode,
      payload.httpStatusCode
    );
  }
}

export interface LoginByMailData {
  mail: string;
  password: string;
}

export interface LoginByPhoneData {
  phone: number;
  otp: string;
}

export interface ForgotPasswordData {
  mail: string;
  password: string;
}

export interface SignupData {
  mail: string;
  password: string;
}

// export class LoginByMailData {
//   constructor(public mail: string, public password: string) {}
// }

// export class LoginByPhoneData {
//   constructor(public phone: number, public otp: string) {}
// }

// export class ForgotPasswordData {
//   constructor(public mail: string, public password: string) {}
// }

// export class SignupData {
//   constructor(public mail: string, public password: string) {}
// }
