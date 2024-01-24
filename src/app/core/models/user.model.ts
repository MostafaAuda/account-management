export class UserInfo {
  constructor(
    public id: string,
    public username?: string,
    public email?: string,
    public phone?: string,
    public birthDate?: string
  ) {}

  public static fromJson(payload: any): UserInfo {
    return new UserInfo(
      payload.id,
      payload.username,
      payload.email,
      payload.phone,
      payload.birthDate
    );
  }
}

export class UserChangePassword {
  constructor(
    public newPassword: string,
    public oldPassword: string,
    public id: string
  ) {}
  public static fromJson(payload: any): UserChangePassword {
    return new UserChangePassword(
      payload.newPassword,
      payload.id,
      payload.oldPassword
    );
  }
}
