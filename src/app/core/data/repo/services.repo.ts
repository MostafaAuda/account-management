import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import {
  Completable,
  Complete,
  Incomplete,
  Result,
} from 'src/app/core/models/.common/result.model';
import { ServiceModel } from '../../models/service.model';
import { ServicesRepoContract } from '../../bloc/.contracts/repos/services.repo-contract';

export abstract class ServicesApiContract {
  abstract getServices(): Observable<Result<ServiceModel[]>>;
  abstract subscribeBundle(id: string, type: string): Observable<Completable>;
  abstract unsubscribeBundle(id: string, type: string): Observable<Completable>;
  abstract getPlansByType(type: string): Observable<Result<ServiceModel[]>>;
}

@Injectable()
export class ServicesRepo implements ServicesRepoContract {
  //#region Private Data Members
  private servicesStream = new BehaviorSubject<ServiceModel[]>([]);
  //#endregion private Data Members

  //#region Public Data Members
  public get services$(): Observable<ServiceModel[]> {
    return this.servicesStream.asObservable();
  }
  public get servicesSnapshot(): ServiceModel[] {
    return this.servicesStream.value;
  }
  //#endregion Public Data Members

  //#region Framework Hooks
  constructor(private ServicesApiContract: ServicesApiContract) {}
  //#endregion Framework Hooks

  //#region Public Methods
  public getServices(): Observable<Completable> {
    // HINT: invalidating cache with pre loading placeholders
    this.servicesStream.next([]);

    return this.ServicesApiContract.getServices().pipe(
      map((plan: Result<ServiceModel[]>) =>
        plan.either(
          // success
          (data: ServiceModel[]) => {
            this.servicesStream.next(data);
            return new Complete();
          },
          (error: Error) => new Incomplete(error)
        )
      )
    );
  }

  public subscribeBundle(_id: string, _Type: string): Observable<Completable> {
    return this.ServicesApiContract.subscribeBundle(_id, _Type).pipe(
      map((responseResult: Completable) =>
        responseResult.either(
          // success
          () => {
            return new Complete();
          },
          // failure
          (error: Error) => new Incomplete(error)
        )
      )
    );
  }

  public unsubscribeBundle(
    _id: string,
    _Type: string
  ): Observable<Completable> {
    return this.ServicesApiContract.unsubscribeBundle(_id, _Type).pipe(
      map((responseResult: Completable) =>
        responseResult.either(
          // success
          () => {
            return new Complete();
          },
          // failure
          (error: Error) => new Incomplete(error)
        )
      )
    );
  }

  public getPlansByType(_type: string): Observable<Completable> {
    // HINT: invalidating cache with pre loading placeholders
    this.servicesStream.next([]);

    return this.ServicesApiContract.getPlansByType(_type).pipe(
      map((plan: Result<ServiceModel[]>) =>
        plan.either(
          // success
          (data: ServiceModel[]) => {
            this.servicesStream.next(data);
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
