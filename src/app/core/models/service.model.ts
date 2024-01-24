export class ServiceModel {
  constructor(
    public id: string,
    public name: string,
    public serviceType: string,
    public totalPlans: number,
    public description: string,
    public logo: string,
    public plansTypeDTO: PlanModel[]
  ) {}

  public static fromJson(payload: any): ServiceModel {
    return new ServiceModel(
      payload.id,
      payload.name,
      payload.serviceType,
      payload.totalPlans,
      payload.description,
      payload.logo,
      payload.plansTypeDTO
    );
  }
}
export class PlanModel {
  constructor(
    public id: string,
    public name: string,
    public plansSubTypeDTO: PlanSubModel[]
  ) {}

  public static fromJson(payload: any): PlanModel {
    return new PlanModel(payload.id, payload.name, payload.plansSubTypeDTO);
  }
}
export class PlanSubModel {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public borderColor: string,
    public linearGradientTop: string,
    public linearGradientBottom: string,
    public price: string,
    public startDate: string,
    public endDate: string,
    public isSubscriped: boolean,
    public autoRenewal: boolean,
    public isCanceled: boolean
  ) {}

  public static fromJson(payload: any): PlanSubModel {
    return new PlanSubModel(
      payload.id,
      payload.name,
      payload.description,
      payload.borderColor,
      payload.linearGradientTop,
      payload.linearGradientBottom,
      payload.price,
      payload.startDate,
      payload.endDate,
      payload.isSubscriped,
      payload.autoRenewal,
      payload.isCanceled
    );
  }
}

export enum ServiceType {
  games = 'games',
  music = 'music',
  tv = 'tv',
  sports = 'sports',
}
