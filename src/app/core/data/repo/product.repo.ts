import { ProductModel } from '../../models/product.model';
import {
  Completable,
  Complete,
  Incomplete,
  Result,
} from '../../models/.common/result.model';
import { ProductRepoContract } from '../../bloc/.contracts/repos/product.repo-contract';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

export abstract class ProductApiContract {
  abstract getProducts(): Observable<Result<ProductModel[]>>;
}

@Injectable()
export class ProductRepo implements ProductRepoContract {
  //#region Private Data Members
  private productsStream = new BehaviorSubject<ProductModel[]>([]);
  //#endregion Private Data Members

  //#region Public Data Members
  public get products$(): Observable<ProductModel[]> {
    return this.productsStream.asObservable();
  }
  public get productsSnapshot(): ProductModel[] {
    return this.productsStream.value;
  }
  //#endregion Public Data Members

  //#region Framework Hooks
  constructor(private productApi: ProductApiContract) {}
  //#endregion Framework Hooks

  //#region Public Methods
  public getProducts(): Observable<Completable> {
    // HINT: invalidating cache with pre loading placeholders
    this.productsStream.next([]);

    return this.productApi.getProducts().pipe(
      map((productsResult: Result<ProductModel[]>) =>
        productsResult.either(
          // success
          (product: ProductModel[]) => {
            this.productsStream.next(product);
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
