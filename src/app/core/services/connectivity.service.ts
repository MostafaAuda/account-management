import { ConnectivityServiceContract } from '../bloc/.contracts/services/connectivity.service-contract';
import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ConnectivityService implements ConnectivityServiceContract {
  //#region Private Data Members
  private connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  //#endregion Private Data Members

  //#region Public Data Members
  public get isConnected$(): Observable<boolean> {
    return this.connected.asObservable();
  }
  //#endregion Public Data Members

  //#region Framework Hooks
  constructor() {
    this.onlineCheck().subscribe((isConnected) =>
      this.connected.next(isConnected)
    );
  }
  //#endregion Framework Hooks

  //#region Private Methods
  private onlineCheck(): Observable<boolean> {
    return merge(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      })
    ) as Observable<boolean>;
  }
  //#endregion Private Methods
}
