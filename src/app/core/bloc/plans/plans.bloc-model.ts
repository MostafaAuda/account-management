import { PlanSubModel } from './../../models/service.model';
export interface plansCategory {
  id: string;
  name: string;
}

//#region States
export enum PlansStateName {
  PlansReadyState = 'PlansReadyState',
  PlansProcessingState = 'PlansProcessingState',
  PlansDisconnectedState = 'PlansDisconnectedState',
  PlansEmptyState = 'PlansEmptyState',
  PlansErrorState = 'PlansErrorState',
}

export abstract class PlansState {
  abstract name: string;
}

export class PlansStateReady implements PlansState {
  public get name(): PlansStateName {
    return PlansStateName.PlansReadyState;
  }
  constructor(
    public serviceName: string,
    public serviceType: string,
    public categories?: plansCategory[],
    public bundles?: PlanSubModel[],
    public activeCategory?: plansCategory
  ) {}
}

export class PlansProcessingState implements PlansState {
  public get name(): PlansStateName {
    return PlansStateName.PlansProcessingState;
  }
}

export class PlansStateDisconnected implements PlansState {
  public get name(): PlansStateName {
    return PlansStateName.PlansDisconnectedState;
  }
}

export class PlansStateEmpty implements PlansState {
  public get name(): PlansStateName {
    return PlansStateName.PlansEmptyState;
  }
}

export class PlansStateError implements PlansState {
  public get name(): PlansStateName {
    return PlansStateName.PlansErrorState;
  }
}
//#endregion States

//#region Events
export enum PlansEventName {
  PlansEventHydrate = 'PlansEventHydrate',
  SubscribeEvent = 'SubscribeEvent',
  UnsubscribeEvent = 'UnsubscribeEvent',
  ChangeCategoryEvent = 'ChangeCategoryEvent',
  ViewPlanDetailsEvent = 'ViewPlanDetailsEvent',
}

export abstract class PlansEvent {
  abstract name: PlansEventName;
}

export class PlansEventHydrate implements PlansState {
  public get name(): PlansEventName {
    return PlansEventName.PlansEventHydrate;
  }
}

export class SubscribeEvent implements PlansState {
  public get name(): PlansEventName {
    return PlansEventName.SubscribeEvent;
  }
  constructor(public bundleID?: string, public bundleName?: string) {}
}

export class UnsubscribeEvent implements PlansState {
  public get name(): PlansEventName {
    return PlansEventName.UnsubscribeEvent;
  }
  constructor(public bundleID?: string, public bundleName?: string) {}
}

export class ChangeCategoryEvent implements PlansState {
  public get name(): PlansEventName {
    return PlansEventName.ChangeCategoryEvent;
  }
  constructor(public id: string) {}
}

export class ViewPlanDetailsEvent implements PlansState {
  public get name(): PlansEventName {
    return PlansEventName.ViewPlanDetailsEvent;
  }
  constructor(public categoryID: string, public serviceType: string) {}
}
//#endregion Events
