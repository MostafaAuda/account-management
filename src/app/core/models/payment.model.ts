import { ServiceType } from './service.model';

export class PaymentMethodModel {
  constructor(
    public readonly paymentId: string,
    public readonly paymentType: PaymentMethodType,
    public readonly creationDate: Date,
    public readonly expirydate: Date,
    public readonly primaryMethod?: boolean,
    public readonly mobileNum?: string,
    public readonly cardNumber?: string
  ) {}

  public static fromJson(payload: any): PaymentMethodModel {
    if (!payload) return payload;

    return new PaymentMethodModel(
      payload.paymentId,
      payload.paymentType,
      payload.creationDate,
      payload.expirydate,
      payload.primaryMethod,
      payload.mobileNum,
      payload.cardNumber
    );
  }
}

export class PaymentHistoryModel {
  constructor(
    public readonly planName: ServiceType,
    public readonly bundlename: string,
    public readonly amount: string,
    public readonly paymentType: PaymentMethodType,
    public readonly creationDate: Date,
    public readonly status: string,
    public readonly mobileNum?: string,
    public readonly cardNumber?: string
  ) {}

  public static fromJson(payload: any): PaymentHistoryModel {
    if (!payload) return payload;

    return new PaymentHistoryModel(
      payload.planName,
      payload.bundlename,
      payload.amount,
      payload.paymentType,
      payload.creationDate,
      payload.status,
      payload.mobileNum,
      payload.cardNumber
    );
  }
}
//#region Enum Declarations
export enum PaymentMethodType {
  CREADITCARD = 'CREADITCARD',
  DCB = 'DCB',
  LOYALITYPOINTS = 'LOYALITYPOINTS',
  COINS = 'COINS',
}
//#endregion Enum Declarations
