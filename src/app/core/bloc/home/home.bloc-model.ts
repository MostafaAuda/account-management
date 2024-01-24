import { ProductModel } from '../../models/product.model';
import { UserInfo } from '../../models/user.model';

//#region States
export enum HomeStateName {
  HomeStateProcessing = 'HomeStateProcessing',
  HomeStateReady = 'HomeStateReady',
  HomeStateError = 'HomeStateError',
  HomeStateDisconnected = 'HomeStateDisconnected',
  HomeStateEmpty = 'HomeStateEmpty',
}

export abstract class HomeState {
  abstract name: string;
}

export class HomeStateProcessing implements HomeState {
  public get name(): HomeStateName {
    return HomeStateName.HomeStateProcessing;
  }
}

export class HomeStateReady implements HomeState {
  public get name(): HomeStateName {
    return HomeStateName.HomeStateReady;
  }

  constructor(
    public userInfo: UserInfo,
    public homeProducts: ProductModel[] = []
  ) {}
}

export class HomeStateError implements HomeState {
  public get name(): HomeStateName {
    return HomeStateName.HomeStateError;
  }
}

export class HomeStateEmpty implements HomeState {
  public get name(): HomeStateName {
    return HomeStateName.HomeStateEmpty;
  }
}

export class HomeStateDisconnected implements HomeState {
  public get name(): HomeStateName {
    return HomeStateName.HomeStateDisconnected;
  }
}
//#endregion States

//#region Events
export enum HomeEventName {
  HomeEventHydrate = 'HomeEventHydrate',
  DiscoverPlansEvent = 'DiscoverPlansEvent',
}

export abstract class HomeEvent {
  abstract name: HomeEventName;
}

export class HomeEventHydrate implements HomeState {
  public get name(): HomeEventName {
    return HomeEventName.HomeEventHydrate;
  }
}

export class DiscoverPlansEvent implements HomeState {
  public get name(): HomeEventName {
    return HomeEventName.DiscoverPlansEvent;
  }

  constructor(public serviceType?: string) {}
}
//#endregion Events
