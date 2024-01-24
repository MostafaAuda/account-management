import { Observable } from 'rxjs';
import { Completable } from 'src/app/core/models/.common/result.model';
import { ServiceModel } from '../../../models/service.model';

export abstract class ServicesRepoContract {
  abstract services$: Observable<ServiceModel[]>;
  abstract servicesSnapshot: ServiceModel[];
  abstract getServices(): Observable<Completable>;
  abstract getPlansByType(id: string): Observable<Completable>;
  abstract subscribeBundle(id?: string, Type?: string): Observable<Completable>;
  abstract unsubscribeBundle(
    id?: string,
    Type?: string
  ): Observable<Completable>;
}
