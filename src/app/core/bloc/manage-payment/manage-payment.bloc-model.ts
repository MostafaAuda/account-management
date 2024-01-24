//#region States

import { PaymentMethodModel } from '../../models/payment.model';

export enum ManagePaymentStateName {
  ManagePaymentStateProcessing = 'ManagePaymentStateProcessing',
  ManagePaymentStateReady = 'ManagePaymentStateReady',
  ManagePaymentStateError = 'ManagePaymentStateError',
  ManagePaymentStateDisconnected = 'ManagePaymentStateDisconnected',
  ManagePaymentStateEmpty = 'ManagePaymentStateEmpty',
}

export abstract class ManagePaymentState {
  abstract name: string;
}

export class ManagePaymentStateProcessing implements ManagePaymentState {
  public get name(): ManagePaymentStateName {
    return ManagePaymentStateName.ManagePaymentStateProcessing;
  }
}

export class ManagePaymentStateReady implements ManagePaymentState {
  public get name(): ManagePaymentStateName {
    return ManagePaymentStateName.ManagePaymentStateReady;
  }

  constructor(public paymentMethods: PaymentMethodModel[] = []) {}
}

export class ManagePaymentStateError implements ManagePaymentState {
  public get name(): ManagePaymentStateName {
    return ManagePaymentStateName.ManagePaymentStateError;
  }
}

export class ManagePaymentStateDisconnected implements ManagePaymentState {
  public get name(): ManagePaymentStateName {
    return ManagePaymentStateName.ManagePaymentStateDisconnected;
  }
}

export class ManagePaymentStateEmpty implements ManagePaymentState {
  public get name(): ManagePaymentStateName {
    return ManagePaymentStateName.ManagePaymentStateEmpty;
  }
}
//#endregion States

//#region events
export enum ManagePaymentEventName {
  ManagePaymentEventHydrate = 'ManagePaymentEventHydrate',
  ManagePaymentEventRemoveMethod = 'ManagePaymentEventRemoveMethod',
  ManagePaymentEventSetDefault = 'ManagePaymentEventSetDefault',
  ManagePaymentEventAddMethod = 'ManagePaymentEventAddMethod',
}

export abstract class ManagePaymentEvent {
  abstract name: ManagePaymentEventName;
}

export class ManagePaymentEventHydrate implements ManagePaymentState {
  public get name(): ManagePaymentEventName {
    return ManagePaymentEventName.ManagePaymentEventHydrate;
  }
}

export class ManagePaymentEventRemoveMethod implements ManagePaymentState {
  public get name(): ManagePaymentEventName {
    return ManagePaymentEventName.ManagePaymentEventRemoveMethod;
  }
  constructor(public paymentId: string, public creationDate: Date) {}
}

export class ManagePaymentEventSetDefault implements ManagePaymentState {
  public get name(): ManagePaymentEventName {
    return ManagePaymentEventName.ManagePaymentEventSetDefault;
  }

  constructor(public id: string, public creationDate: Date) {}
}

export class ManagePaymentEventAddMethod implements ManagePaymentState {
  public get name(): ManagePaymentEventName {
    return ManagePaymentEventName.ManagePaymentEventAddMethod;
  }
}
//#endregion events
