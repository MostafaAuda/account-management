export class UserSubscriptionsModel {
  constructor(
    public id: string,
    public serviceType: string,
    public planTypeID: string,
    public bundleID: string,
    public bundle: string,
    public price: string,
    public nextBillingDate: string
  ) {}

  public static fromJson(payload: any): UserSubscriptionsModel {
    return new UserSubscriptionsModel(
      payload.id,
      payload.serviceType,
      payload.planTypeID,
      payload.bundleID,
      payload.bundle,
      payload.price,
      payload.nextBillingDate
    );
  }
}
