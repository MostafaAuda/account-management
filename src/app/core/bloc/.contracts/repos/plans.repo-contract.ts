import { Observable } from 'rxjs';
import { Completable } from 'src/app/core/models/.common/result.model';
import { PlansModel } from '../../../models/plans.model';

export abstract class PlansRepoContract {
  abstract plans$: Observable<PlansModel[]>;
  abstract plansSnapshot: PlansModel[];
  abstract getPlans(): Observable<Completable>;
}
