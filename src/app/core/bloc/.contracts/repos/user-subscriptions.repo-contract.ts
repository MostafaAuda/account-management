import { Observable } from 'rxjs';
import { Completable } from 'src/app/core/models/.common/result.model';
import { UserSubscriptionsModel } from '../../../models/user-subscriptions.model';

export abstract class UserSubscriptionsRepoContract {
  abstract getUserSubscription(): Observable<Completable>;
  abstract userSubscription$: Observable<UserSubscriptionsModel[]>;
  abstract userSubscriptionSnapshot: UserSubscriptionsModel[];
  abstract cancelSubscription(id: string): void;
}
