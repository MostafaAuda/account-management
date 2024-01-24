import { UserInfo } from 'src/app/core/models/user.model';

//#region States
export enum UpdateInfoStatesName {
  UpdateUserInfoReadyState = 'UpdateUserInfoReadyState',
  UpdateUserInfoProcessingState = 'UpdateUserInfoProcessingState',
  UpdateUserInfoDisconnectedState = 'UpdateUserInfoDisconnectedState',
}

export abstract class UpdateInfoStates {
  abstract name: string;
}

export class UpdateUserInfoProcessingState implements UpdateInfoStates {
  public get name(): UpdateInfoStatesName {
    return UpdateInfoStatesName.UpdateUserInfoProcessingState;
  }
}

export class UpdateUserInfoReadyState implements UpdateInfoStates {
  public get name(): UpdateInfoStatesName {
    return UpdateInfoStatesName.UpdateUserInfoReadyState;
  }
  constructor(public recentInfo: UserInfo) {}
}

export class UpdateUserInfoDisconnectedState implements UpdateInfoStates {
  public get name(): UpdateInfoStatesName {
    return UpdateInfoStatesName.UpdateUserInfoDisconnectedState;
  }
}
//#endregion States

//#region Events

export enum UpdateInfoEventsName {
  saveUpdateInfo = 'saveUpdateInfo',
  HydrateEvent = 'HydrateEvent',
}
export abstract class UpdateInfoEvent {
  abstract name: UpdateInfoEventsName;
}

export class SaveUpdateInfoEvent implements UpdateInfoStates {
  public get name(): UpdateInfoEventsName {
    return UpdateInfoEventsName.saveUpdateInfo;
  }
  constructor(public data?: any) {}
}
export class HydrateEvent implements UpdateInfoStates {
  public get name(): UpdateInfoEventsName {
    return UpdateInfoEventsName.HydrateEvent;
  }
  constructor(public data?: any) {}
}

//#endregion Events
