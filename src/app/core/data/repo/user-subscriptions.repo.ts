import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { UserSubscriptionsRepoContract } from '../../bloc/.contracts/repos/user-subscriptions.repo-contract';
import {
  Completable,
  Complete,
  Incomplete,
  Result,
} from '../../models/.common/result.model';
import { UserSubscriptionsModel } from '../../models/user-subscriptions.model';

export abstract class UserSubscriptionsApiContract {
  abstract getUserSubscriptions(): Observable<Result<UserSubscriptionsModel[]>>;
  abstract cancelUserSubscription(id: string): Observable<Completable>;
}

@Injectable()
export class UserSubscriptionsRepo implements UserSubscriptionsRepoContract {
  //#region Private Data Members
  private userSubscriptionStream = new BehaviorSubject<
    UserSubscriptionsModel[]
  >([]);
  //#endregion Private Data Members

  //#region Public Data Members
  public get userSubscription$(): Observable<UserSubscriptionsModel[]> {
    return this.userSubscriptionStream.asObservable();
  }
  public get userSubscriptionSnapshot(): UserSubscriptionsModel[] {
    return this.userSubscriptionStream.value;
  }
  //#endregion Public Data Members

  //#region Framework Hooks
  constructor(private userSubscriptionsApi: UserSubscriptionsApiContract) {}
  //#endregion Framework Hooks

  //#region Public Methods
  public getUserSubscription(): Observable<Completable> {
    // HINT: invalidating cache with pre loading placeholders
    this.userSubscriptionStream.next([]);

    return this.userSubscriptionsApi.getUserSubscriptions().pipe(
      map((responseResult: Result<UserSubscriptionsModel[]>) =>
        responseResult.either(
          // success
          (userSubscriptionResult: UserSubscriptionsModel[]) => {
            this.userSubscriptionStream.next(userSubscriptionResult);
            return new Complete();
          },
          // failure
          (error: Error) => new Incomplete(error)
        )
      )
    );
  }

  public cancelSubscription(id: string): Observable<Completable> {
    // HINT: invalidating cache with pre loading placeholders
    this.userSubscriptionStream.next([]);

    return this.userSubscriptionsApi.cancelUserSubscription(id).pipe(
      map((res: Completable) =>
        res.either(
          // success
          () => {
            this.userSubscriptionStream.next(
              this.userSubscriptionSnapshot.filter((x) => x.id !== id)
            );
            return new Complete();
          },
          // failure
          (error: Error) => new Incomplete(error)
        )
      )
    );
  }
  //#endregion Public Methods
}
