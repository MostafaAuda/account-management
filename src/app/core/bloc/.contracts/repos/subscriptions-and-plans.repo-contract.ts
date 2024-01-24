import { ServiceModel, ServicesPlansModel, SubscriptionModel } from '../../../models/twist-plans.model';
import { Observable } from "rxjs";
import { Completable } from 'src/app/core/models/.common/result.model';

export abstract class SubscriptionsAndPlansRepoContract {

  abstract servicesPlans$: Observable<ServicesPlansModel[]>;
  abstract servicesPlansSnapshot: ServicesPlansModel[];
  abstract getServicesPlans(serviceId: string): Observable<Completable>;
  abstract subscribeInPlan(plan: object): void;
  abstract unSubscribeInPlan(plan: object): void;

  abstract subscriptions$: Observable<SubscriptionModel[]>;
  abstract subscriptionsSnapshot: SubscriptionModel[];
  abstract getSubscriptions(): Observable<Completable>;

  abstract services$: Observable<ServiceModel[]>;
  abstract servicesSnapshot: ServiceModel[];
  abstract getAllPlans(): Observable<Completable>;
}
