import { ProductModel } from '../../../models/product.model';
import { Completable } from '../../../models/.common/result.model';
import { Observable } from 'rxjs';

export abstract class ProductRepoContract {
  abstract products$: Observable<ProductModel[]>;
  abstract productsSnapshot: ProductModel[];
  abstract getProducts(): Observable<Completable>;
}
