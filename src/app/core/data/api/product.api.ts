import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  customErrorException,
  Failed,
  Result,
  Success,
} from '../../models/.common/result.model';
import { ProductModel } from '../../models/product.model';
import { catchError, map } from 'rxjs/operators';
import { ProductApiContract } from '../repo/product.repo';

@Injectable()
export class ProductApi implements ProductApiContract {
  //#region Framework Hooks
  constructor(private httpClient: HttpClient) {}
  //#endregion Framework Hooks

  //#region Public Methods
  public getProducts(): Observable<Result<ProductModel[]>> {
    return this.httpClient
      .get('https://fake-frontend-apis.api.quickmocker.com/products', {})
      .pipe(
        map(
          (value: any) =>
            new Success<ProductModel[]>(
              (value ?? []).map((x: any) => ProductModel.fromJson(x))
            )
        ),
        catchError((error: customErrorException) =>
          of(new Failed<ProductModel[]>(error))
        )
      );
  }
  //#endregion Public Methods
}
