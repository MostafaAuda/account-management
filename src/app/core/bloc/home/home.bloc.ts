import { Router } from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription, forkJoin } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ProductRepoContract } from '../.contracts/repos/product.repo-contract';
import { UserRepoContract } from '../.contracts/repos/user.repo-contract';
import { ConnectivityServiceContract } from '../.contracts/services/connectivity.service-contract';
import {
  DiscoverPlansEvent,
  HomeEvent,
  HomeEventHydrate,
  HomeEventName,
  HomeState,
  HomeStateName,
  HomeStateDisconnected,
  HomeStateError,
  HomeStateProcessing,
  HomeStateReady,
} from './home.bloc-model';
@Injectable()
export class HomeBloc implements OnDestroy {
  //#region Private Data Members
  private stateStream = new BehaviorSubject<HomeState>(
    new HomeStateProcessing()
  );
  private isErrorState: boolean = false;
  private openSubscriptions: Subscription[] = [];
  //#endregion Private Data Members

  //#region Public Data Members
  public events = new Subject<HomeEvent>();
  public get states$(): Observable<HomeState> {
    return this.stateStream.asObservable();
  }
  //#endregion Public Data Members

  //#region Framework Hooks
  constructor(
    private productRepo: ProductRepoContract,
    private userRepo: UserRepoContract,
    private connectivityService: ConnectivityServiceContract,
    private router: Router
  ) {
    this.subscribeViewEvents();
    this.checkConnectivityStatus();
  }

  public ngOnDestroy(): void {
    this.unsubscribeOpenSubscriptions();
  }
  //#endregion Framework Hooks

  //#region Private Methods
  private handleHydrate(_event?: HomeEventHydrate): void {
    const homeSubscription = forkJoin([
      this.userRepo.getUserInfo(),
      this.productRepo.getProducts(),
    ]).subscribe((res) => {
      (res[0] && res[1]).either(
        () => {
          this.isErrorState = false;
          this.stateStream.next(
            new HomeStateReady(
              this.userRepo.recentInfoSnapshot[0],
              this.productRepo.productsSnapshot
            )
          );
        },
        (_err: Error) => {
          this.isErrorState = true;
          this.stateStream.next(new HomeStateError());
        }
      );
    });

    this.openSubscriptions.push(homeSubscription);
  }

  private subscribeViewEvents(): void {
    const eventsSubscription = this.events.subscribe((event) =>
      this.handleIncomingEvents(event)
    );
    this.openSubscriptions.push(eventsSubscription);
  }

  private checkConnectivityStatus(): void {
    const connectionCheckingSubscription =
      this.connectivityService.isConnected$.subscribe((connected) =>
        this.onConnectivityChanged(connected)
      );

    this.openSubscriptions.push(connectionCheckingSubscription);
  }

  private unsubscribeOpenSubscriptions(): void {
    if (this.openSubscriptions.length) {
      this.openSubscriptions.forEach((sub) => sub.unsubscribe());
    }
  }
  //#endregion Private Methods

  //#region Private Event Handlers
  private handleIncomingEvents(event: HomeEvent): void {
    if (!event) {
      return;
    }

    switch (event.name) {
      case HomeEventName.HomeEventHydrate:
        this.handleHydrate(event as HomeEventHydrate);
        break;
      case HomeEventName.DiscoverPlansEvent:
        this.handleGoToDiscoverPlans(event as DiscoverPlansEvent);
        break;
    }
  }

  private handleGoToDiscoverPlans(_event: DiscoverPlansEvent): void {
    this.router.navigate(['/plans/' + _event.serviceType]);
  }

  private onConnectivityChanged(isConnected: boolean): void {
    if (isConnected) {
      if (
        this.stateStream?.value?.name === HomeStateName.HomeStateDisconnected
      ) {
        if (!this.isErrorState) {
          this.stateStream.next(
            new HomeStateReady(
              this.userRepo.recentInfoSnapshot[0],
              this.productRepo.productsSnapshot
            )
          );
        } else {
          this.stateStream.next(new HomeStateError());
        }
      }
    } else {
      this.stateStream.next(new HomeStateDisconnected());
    }
  }
  //#endregion Private Event Handlers
}
