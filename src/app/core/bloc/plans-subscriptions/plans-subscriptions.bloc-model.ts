import { ServiceModel } from '../../models/service.model';
import { UserSubscriptionsModel } from '../../models/user-subscriptions.model';

//#region States
export enum PlansSubscriptionsStateName {
  PlansSubscriptionsStateProcessing = 'PlansSubscriptionsStateProcessing',
  PlansSubscriptionsStateReady = 'PlansSubscriptionsStateReady',
  PlansSubscriptionsStateError = 'PlansSubscriptionsStateError',
  PlansSubscriptionsStateDisconnected = 'PlansSubscriptionsStateDisconnected',
  PlansSubscriptionsStateEmpty = 'PlansSubscriptionsStateEmpty',
}

export abstract class PlansSubscriptionsState {
  abstract name: string;
}

export class PlansSubscriptionsStateProcessing
  implements PlansSubscriptionsState
{
  public get name(): PlansSubscriptionsStateName {
    return PlansSubscriptionsStateName.PlansSubscriptionsStateProcessing;
  }
}

export class PlansSubscriptionsStateReady implements PlansSubscriptionsState {
  public get name(): PlansSubscriptionsStateName {
    return PlansSubscriptionsStateName.PlansSubscriptionsStateReady;
  }

  constructor(
    public plans: ServiceModel[] = [],
    public userSubscriptions: UserSubscriptionsModel[] = []
  ) {}
}

export class PlansSubscriptionsStateError implements PlansSubscriptionsState {
  public get name(): PlansSubscriptionsStateName {
    return PlansSubscriptionsStateName.PlansSubscriptionsStateError;
  }
}

export class PlansSubscriptionsStateDisconnected
  implements PlansSubscriptionsState
{
  public get name(): PlansSubscriptionsStateName {
    return PlansSubscriptionsStateName.PlansSubscriptionsStateDisconnected;
  }
}

export class PlansSubscriptionsStateEmpty implements PlansSubscriptionsState {
  public get name(): PlansSubscriptionsStateName {
    return PlansSubscriptionsStateName.PlansSubscriptionsStateEmpty;
  }
}
//#endregion States

//#region Events
export enum PlansSubscriptionsEventName {
  PlansSubscriptionsEventHydrate = 'PlansSubscriptionsEventHydrate',
  DiscoverPlansEvent = 'DiscoverPlansEvent',
  ViewPlanDetailsEvent = 'ViewPlanDetailsEvent',
  CancelSubscriptionEvent = 'CancelSubscriptionEvent',
}

export abstract class PlansSubscriptionsEvent {
  abstract name: PlansSubscriptionsEventName;
}

export class PlansSubscriptionsEventHydrate implements PlansSubscriptionsState {
  public get name(): PlansSubscriptionsEventName {
    return PlansSubscriptionsEventName.PlansSubscriptionsEventHydrate;
  }
}

export class DiscoverPlansEvent implements PlansSubscriptionsState {
  public get name(): PlansSubscriptionsEventName {
    return PlansSubscriptionsEventName.DiscoverPlansEvent;
  }
  constructor(public serviceType?: string) {}
}

export class ViewPlanDetailsEvent implements PlansSubscriptionsState {
  public get name(): PlansSubscriptionsEventName {
    return PlansSubscriptionsEventName.ViewPlanDetailsEvent;
  }
  constructor(public serviceType?: string, public categoryID?: string) {}
}

export class CancelSubscriptionEvent implements PlansSubscriptionsState {
  public get name(): PlansSubscriptionsEventName {
    return PlansSubscriptionsEventName.CancelSubscriptionEvent;
  }
  constructor(public bundleID?: string, public bundleName?: string) {}
}
//#endregion Events
