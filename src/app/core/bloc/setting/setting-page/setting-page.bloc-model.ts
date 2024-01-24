//#region States
export enum SettingStatesName {
  ConnectedWithFb = 'ConnectedWithFb',
  ConnectedWithGoogle = 'ConnectedWithGoogle',
  ArLang = 'ArLang',
  EnLang = 'EnLang',
  DisconnectedState = 'DisconnectedState',
}
export abstract class SettingStates {
  abstract name: string;
}

export class ConnectedWithFbState implements SettingStates {
  public get name(): SettingStatesName {
    return SettingStatesName.ConnectedWithFb;
  }
}
export class ConnectedWithGoogleState implements SettingStates {
  public get name(): SettingStatesName {
    return SettingStatesName.ConnectedWithGoogle;
  }
}
export class ArLangState implements SettingStates {
  public get name(): SettingStatesName {
    return SettingStatesName.ArLang;
  }
}
export class EnLangState implements SettingStates {
  public get name(): SettingStatesName {
    return SettingStatesName.EnLang;
  }
}

export class DisconnectedState implements SettingStates {
  public get name(): SettingStatesName {
    return SettingStatesName.DisconnectedState;
  }
}
//#endregion States

//#region Events
export enum SettingEventsName {
  Signout = 'Signout',
  ConnectWithGoogle = 'ConnectWithGoogle',
  ConnectWithFacebook = 'ConnectWithFacebook',
  ConnectWithApple = 'ConnectWithApple',
  SwitchLang = 'SwitchLang',
  GoToUpdateInfo = 'GoToUpdateInfo',
  GoToChangePassword = 'GoToChangePassword',
}

export abstract class SettingEvents {
  abstract name: SettingEventsName;
}

export class SignoutEvent implements SettingStates {
  public get name(): SettingEventsName {
    return SettingEventsName.Signout;
  }
  constructor(public data?: any) {}
}
export class ConnectWithFbEvent implements SettingStates {
  public get name(): SettingEventsName {
    return SettingEventsName.ConnectWithFacebook;
  }
  constructor(public data?: any) {}
}
export class ConnectWithGoogleEvent implements SettingStates {
  public get name(): SettingEventsName {
    return SettingEventsName.ConnectWithGoogle;
  }
  constructor(public data?: any) {}
}

export class ConnectWithAppleEvent implements SettingStates {
  public get name(): SettingEventsName {
    return SettingEventsName.ConnectWithApple;
  }
  constructor(public data?: any) {}
}

export class SwitchLangEvent implements SettingStates {
  public get name(): SettingEventsName {
    return SettingEventsName.SwitchLang;
  }
  constructor(public data?: any) {}
}
export class GoToUpdateInfoEvent implements SettingStates {
  public get name(): SettingEventsName {
    return SettingEventsName.GoToUpdateInfo;
  }
}
export class GoToChangePasswordEvent implements SettingStates {
  public get name(): SettingEventsName {
    return SettingEventsName.GoToChangePassword;
  }
}
//#endregion Events
