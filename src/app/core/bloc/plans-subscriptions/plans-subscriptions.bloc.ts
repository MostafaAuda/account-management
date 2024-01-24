import {
  ConfirmationDialogServiceContract,
  IconTypes,
} from 'src/app/core/bloc/.contracts/services/confirm-dialog.service-contract';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, Subject, Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ServicesRepoContract } from '../.contracts/repos/services.repo-contract';
import { UserSubscriptionsRepoContract } from '../.contracts/repos/user-subscriptions.repo-contract';
import { ConnectivityServiceContract } from '../.contracts/services/connectivity.service-contract';
import {
  PlansSubscriptionsEvent,
  PlansSubscriptionsEventHydrate,
  PlansSubscriptionsEventName,
  CancelSubscriptionEvent,
  PlansSubscriptionsState,
  PlansSubscriptionsStateDisconnected,
  PlansSubscriptionsStateError,
  PlansSubscriptionsStateProcessing,
  PlansSubscriptionsStateReady,
  DiscoverPlansEvent,
  ViewPlanDetailsEvent,
  PlansSubscriptionsStateName,
} from './plans-subscriptions.bloc-model';
import {
  SnackbarServiceContract,
  snackbarType,
} from '../.contracts/services/snackbar.service-contract';
import { LoadingSpinnerServiceContract } from '../.contracts/services/loading-spinner.service-contract';
@Injectable()
export class PlansSubscriptionsBloc {
  //#region Private Data Members
  private stateStream = new BehaviorSubject<PlansSubscriptionsState>(
    new PlansSubscriptionsStateProcessing()
  );
  private isErrorState: boolean = false;
  private openSubscriptions: Subscription[] = [];
  //#endregion Private Data Members

  //#region Public Data Members
  public events = new Subject<PlansSubscriptionsEvent>();
  public get states$(): Observable<PlansSubscriptionsState> {
    return this.stateStream.asObservable();
  }
  //#endregion Public Data Members

  //#region Framework Hooks
  constructor(
    private plansRepo: ServicesRepoContract,
    private userSubscriptionsRepo: UserSubscriptionsRepoContract,
    private connectivityService: ConnectivityServiceContract,
    private router: Router,
    private confirmDialog: ConfirmationDialogServiceContract,
    private snackBar: SnackbarServiceContract,
    private loadingSpinner: LoadingSpinnerServiceContract
  ) {
    this.subscribeViewEvents();
    this.checkConnectivityStatus();
  }

  public ngOnDestroy(): void {
    this.unsubscribeOpenSubscriptions();
  }
  //#endregion Framework Hooks

  //#region Private Methods
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

  private onConnectivityChanged(isConnected: boolean): void {
    if (isConnected) {
      if (
        this.stateStream?.value?.name ===
        PlansSubscriptionsStateName.PlansSubscriptionsStateDisconnected
      ) {
        if (!this.isErrorState) {
          this.stateStream.next(
            new PlansSubscriptionsStateReady(
              this.plansRepo.servicesSnapshot,
              this.userSubscriptionsRepo.userSubscriptionSnapshot
            )
          );
        } else {
          this.stateStream.next(new PlansSubscriptionsStateError());
        }
      }
    } else {
      this.stateStream.next(new PlansSubscriptionsStateDisconnected());
    }
  }

  private unsubscribeOpenSubscriptions(): void {
    if (this.openSubscriptions?.length) {
      this.openSubscriptions?.forEach((sub) => sub?.unsubscribe());
    }
  }
  //#endregion Private Methods

  //#region Private Event Handlers
  private handleIncomingEvents(event: PlansSubscriptionsEvent): void {
    if (!event) {
      return;
    }

    switch (event.name) {
      case PlansSubscriptionsEventName.PlansSubscriptionsEventHydrate:
        this.handleHydrate(event as PlansSubscriptionsEventHydrate);
        break;
      case PlansSubscriptionsEventName.DiscoverPlansEvent:
        this.handleDiscoverPlans(event as DiscoverPlansEvent);
        break;
      case PlansSubscriptionsEventName.ViewPlanDetailsEvent:
        this.handleViewPlanDetails(event as ViewPlanDetailsEvent);
        break;
      case PlansSubscriptionsEventName.CancelSubscriptionEvent:
        this.handleCancelSubscription(event as CancelSubscriptionEvent);
    }
  }

  private handleHydrate(_event?: PlansSubscriptionsEventHydrate): void {
    const subscriptions = forkJoin([
      this.plansRepo.getServices(),
      this.userSubscriptionsRepo.getUserSubscription(),
    ]).subscribe((res) => {
      (res[0] && res[1]).either(
        () => {
          this.isErrorState = false;
          this.stateStream.next(
            new PlansSubscriptionsStateReady(
              this.plansRepo.servicesSnapshot,
              this.userSubscriptionsRepo.userSubscriptionSnapshot
            )
          );
        },
        (_err: Error) => {
          this.isErrorState = true;
          this.stateStream.next(new PlansSubscriptionsStateError());
        }
      );
    });

    this.openSubscriptions.push(subscriptions);
  }

  private handleDiscoverPlans(_event: DiscoverPlansEvent): void {
    this.router.navigate(['/plans/' + _event.serviceType]);
  }

  private handleViewPlanDetails(_event: ViewPlanDetailsEvent): void {
    if (_event.categoryID) {
      this.router.navigate(['/plans', _event.serviceType], {
        queryParams: {
          categoryID: _event.categoryID,
        },
      });
    } else {
      this.router.navigate(['/plans/' + _event.serviceType]);
    }
  }

  private handleCancelSubscription(_event: CancelSubscriptionEvent): void {
    this.confirmDialog.showConfirmationDialog({
      title: 'Are you sure you want to cancel subscription?',
      iconType: IconTypes.Disapprove,
      confirmFunction: this.confirmUnSubscribe.bind(this, _event),
    });
  }

  private confirmUnSubscribe(_event: CancelSubscriptionEvent): void {
    this.loadingSpinner.showLoader();
    this.plansRepo
      .unsubscribeBundle(_event.bundleID, _event.bundleName)
      .subscribe((result) => {
        result.either(
          // success
          () => {
            this.stateStream.next(new PlansSubscriptionsEventHydrate());
            this.loadingSpinner.hideLoader();
            this.snackBar.show(
              'Succesfully unsubscribed!',
              snackbarType.Success
            );
          },
          // error
          (_error) => {
            this.loadingSpinner.hideLoader();
            this.snackBar.show(
              'Something went wrong, please try again',
              snackbarType.Error
            );
          }
        );
      });
  }
  //#endregion Private Event Handlers
}
