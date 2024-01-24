//#region States
export enum ChangePasswordStatesName {
  ConnectedState = 'ConnectedState',
  DisconnectedState = 'DisconnectedState',
}
export abstract class ChangePasswordStates {
  abstract name: string;
}

export class ConnectedState implements ChangePasswordStates {
  public get name(): ChangePasswordStatesName {
    return ChangePasswordStatesName.ConnectedState;
  }
}
export class DisconnectedState implements ChangePasswordStates {
  public get name(): ChangePasswordStatesName {
    return ChangePasswordStatesName.DisconnectedState;
  }
}
//#endregion States

//#region Events
export enum ChangePasswordEventsName {
  changePassword = 'changePassword',
}

export abstract class ChangePasswordEvents {
  abstract name: ChangePasswordEventsName;
}

export class ChangePasswordEvent {
  public get name(): ChangePasswordEventsName {
    return ChangePasswordEventsName.changePassword;
  }
  constructor(public data?: any) {}
}
//#endregion Events
