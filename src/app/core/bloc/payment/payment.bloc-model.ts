import {
  PaymentHistoryModel,
  PaymentMethodModel,
} from '../../models/payment.model';

//#region States
export enum PaymentStateName {
  PaymentStateProcessing = 'PaymentStateProcessing',
  PaymentStateReady = 'PaymentStateReady',
  PaymentStateError = 'PaymentStateError',
  PaymentStateDisconnected = 'PaymentStateDisconnected',
}

export abstract class PaymentState {
  abstract name: string;
}

export class PaymentStateProcessing implements PaymentState {
  public get name(): PaymentStateName {
    return PaymentStateName.PaymentStateProcessing;
  }
}

export class PaymentStateReady implements PaymentState {
  public get name(): PaymentStateName {
    return PaymentStateName.PaymentStateReady;
  }

  constructor(
    public paymentHistory: PaymentHistoryModel[] = [],
    public paymentMethods: PaymentMethodModel[] = []
  ) {}
}

export class PaymentStateError implements PaymentState {
  public get name(): PaymentStateName {
    return PaymentStateName.PaymentStateError;
  }
}

export class PaymentStateDisconnected implements PaymentState {
  public get name(): PaymentStateName {
    return PaymentStateName.PaymentStateDisconnected;
  }
}
//#endregion States

//#region Events
export enum PaymentEventName {
  PaymentEventHydrate = 'PaymentEventHydrate',
  PaymentEventManagePaymentMethod = 'PaymentEventManagePaymentMethod',
  PaymentEventGotoSubscriptions = 'PaymentEventGotoSubscriptions',
}

export abstract class PaymentEvent {
  abstract name: PaymentEventName;
}

export class PaymentEventHydrate implements PaymentState {
  public get name(): PaymentEventName {
    return PaymentEventName.PaymentEventHydrate;
  }
}

export class PaymentEventManagePaymentMethod implements PaymentState {
  public get name(): PaymentEventName {
    return PaymentEventName.PaymentEventManagePaymentMethod;
  }
}

export class PaymentEventGotoSubscriptions implements PaymentState {
  public get name(): PaymentEventName {
    return PaymentEventName.PaymentEventGotoSubscriptions;
  }
}
//#endregion Events
