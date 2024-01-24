import { Observable } from 'rxjs';

export abstract class ConnectivityServiceContract {
  abstract isConnected$: Observable<boolean>;
}
