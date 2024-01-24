import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { PaymentRepoContract } from '../.contracts/repos/payment.repo-contract';
import {
  ConfirmationDialogServiceContract,
  IconTypes,
} from '../.contracts/services/confirm-dialog.service-contract';
import { ConnectivityServiceContract } from '../.contracts/services/connectivity.service-contract';
import { LoadingSpinnerServiceContract } from '../.contracts/services/loading-spinner.service-contract';
import {
  SnackbarServiceContract,
  snackbarType,
} from '../.contracts/services/snackbar.service-contract';
import {
  ManagePaymentEvent,
  ManagePaymentEventAddMethod,
  ManagePaymentEventHydrate,
  ManagePaymentEventName,
  ManagePaymentEventRemoveMethod,
  ManagePaymentEventSetDefault,
  ManagePaymentState,
  ManagePaymentStateDisconnected,
  ManagePaymentStateError,
  ManagePaymentStateName,
  ManagePaymentStateProcessing,
  ManagePaymentStateReady,
} from './manage-payment.bloc-model';

@Injectable()
export class ManagePaymentBloc implements OnDestroy {
  //#region Private Data Members
  private stateStream = new BehaviorSubject<ManagePaymentState>(
    new ManagePaymentStateProcessing()
  );
  private openSubscriptions: Subscription[] = [];
  private paymentMethodsSubscription$?: Subscription;
  private isErrorState: boolean = false;
  //#endregion Private Data Members

  //#region Public Data Members
  public events = new Subject<ManagePaymentEvent>();
  public get states$(): Observable<ManagePaymentState> {
    return this.stateStream.asObservable();
  }
  //#endregion Public Data Members

  //#region Framework Hooks
  constructor(
    private connectivityService: ConnectivityServiceContract,
    private paymentRepo: PaymentRepoContract,
    private confirmDialog: ConfirmationDialogServiceContract,
    private loadingSpinner: LoadingSpinnerServiceContract,
    private snackBar: SnackbarServiceContract
  ) {
    this.subscribeViewEvents();
    this.checkConnectivityStatus();
  }

  ngOnDestroy(): void {
    this.unsubscribeOpenSubscriptions();
  }
  //#endregion Framework Hooks

  //#region Private Event Handlers
  private handleHydrate(_event: ManagePaymentEventHydrate) {
    this.paymentRepo.fetchPaymentMethods().subscribe((res) => {
      res.either(
        () => {
          this.updateDataStreamOnActions();
        },
        () => {
          this.stateStream.next(new ManagePaymentStateError());
        }
      );
    });
  }

  private handleAddMethod(_event: ManagePaymentEventAddMethod): void {
    //todo add router link
  }

  private handleRemoveMethod(_event: ManagePaymentEventRemoveMethod): void {
    this.confirmDialog.showConfirmationDialog({
      title: 'Are you sure you want to remove your payment method?',
      iconType: IconTypes.Disapprove,
      confirmFunction: this.confirmRemoveMethod.bind(this, _event),
    });
  }

  private handleSetMethod(_event: ManagePaymentEventSetDefault): void {
    this.loadingSpinner.showLoader();
    this.paymentRepo
      .setDefaultMethod(_event.id, _event.creationDate)
      .subscribe((res) => {
        res.either(
          () => {
            this.loadingSpinner.hideLoader();
          },
          () => {
            this.loadingSpinner.hideLoader();
          }
        );
      });
  }
  //#endregion Private Event Handlers

  //#region Private Methods
  private unsubscribeOpenSubscriptions(): void {
    if (this.openSubscriptions.length) {
      this.openSubscriptions.forEach((sub) => sub.unsubscribe());
    }
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

  private onConnectivityChanged(isConnected: boolean): void {
    if (isConnected) {
      if (
        this.stateStream?.value?.name ==
        ManagePaymentStateName.ManagePaymentStateDisconnected
      ) {
        if (!this.isErrorState) {
          this.stateStream.next(
            new ManagePaymentStateReady(this.paymentRepo.paymentMethodsSnapshot)
          );
        } else {
          this.stateStream.next(new ManagePaymentStateError());
        }
      }
    } else {
      this.stateStream.next(new ManagePaymentStateDisconnected());
    }
  }

  private handleIncomingEvents(event: ManagePaymentEvent): void {
    if (!event) {
      return;
    }

    switch (event.name) {
      case ManagePaymentEventName.ManagePaymentEventHydrate:
        this.handleHydrate(event as ManagePaymentEventHydrate);
        break;
      case ManagePaymentEventName.ManagePaymentEventAddMethod:
        this.handleAddMethod(event as ManagePaymentEventAddMethod);
        break;
      case ManagePaymentEventName.ManagePaymentEventRemoveMethod:
        this.handleRemoveMethod(event as ManagePaymentEventRemoveMethod);
        break;

      case ManagePaymentEventName.ManagePaymentEventSetDefault:
        this.handleSetMethod(event as ManagePaymentEventSetDefault);
        break;
    }
  }

  private updateDataStreamOnActions(): void {
    if (!this.paymentMethodsSubscription$) {
      this.paymentMethodsSubscription$ =
        this.paymentRepo.paymentMethods$.subscribe(() => {
          this.stateStream.next(
            new ManagePaymentStateReady(this.paymentRepo.paymentMethodsSnapshot)
          );
        });
      this.openSubscriptions.push(this.paymentMethodsSubscription$);
    }
  }

  private confirmRemoveMethod(event: ManagePaymentEventRemoveMethod): void {
    this.loadingSpinner.showLoader();

    this.paymentRepo
      .removePaymentMethod(event.paymentId, event.creationDate)
      .subscribe((result) => {
        result.either(
          () => {
            this.loadingSpinner.hideLoader();
            this.snackBar.show(
              'Payment method removed successfully',
              snackbarType.Success
            );
          },
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
  //#endregion Private Methods
}
