import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Failed, Result, Success } from '../../models/.common/result.model';
import { catchError, map } from 'rxjs/operators';
import { PlansApiContract } from '../repo/plans.repo';
import { PlansModel } from '../../models/plans.model';

@Injectable()
export class PlansApi implements PlansApiContract {
  //#region Framework Hooks
  constructor(private httpClient: HttpClient) {}
  //#endregion Framework Hooks

  //#region Public Methods
  public getPlans(): Observable<Result<PlansModel[]>> {
    return this.httpClient
      .get('https://fake-frontend-apis.api.quickmocker.com/plans', {})
      .pipe(
        map(
          (value: any) =>
            new Success<PlansModel[]>(
              (value ?? []).map((x: any) => PlansModel.fromJson(x))
            )
        ),
        catchError((error: Error) => of(new Failed<PlansModel[]>(error)))
      );
  }
  //#endregion Public Methods
}
