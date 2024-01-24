import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { PaymentRepoContract } from '../.contracts/repos/payment.repo-contract';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import {
  PaymentEvent,
  PaymentEventHydrate,
  PaymentEventName,
  PaymentState,
  PaymentStateDisconnected,
  PaymentStateProcessing,
  PaymentEventGotoSubscriptions,
  PaymentStateReady,
  PaymentStateError,
  PaymentStateName,
  PaymentEventManagePaymentMethod,
} from './payment.bloc-model';
import { ConnectivityServiceContract } from '../.contracts/services/connectivity.service-contract';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PaymentMethodModel } from '../../models/payment.model';

@Injectable()
export class PaymentBloc implements OnDestroy {
  //#region Private Data Members
  private stateStream = new BehaviorSubject<PaymentState>(
    new PaymentStateProcessing()
  );
  private openSubscriptions: Subscription[] = [];
  private paymentMethodsSubscription$?: Subscription;
  private isErrorState: boolean = false;
  //#endregion Private Data Members

  //#region Public Data Members
  public events = new Subject<PaymentEvent>();
  public get states$(): Observable<PaymentState> {
    return this.stateStream.asObservable();
  }
  //#endregion Public Data Members

  //#region Framework Hooks
  constructor(
    private paymentRepo: PaymentRepoContract,
    private route: Router,
    private connectivityService: ConnectivityServiceContract
  ) {
    this.subscribeViewEvents();
    this.checkConnectivityStatus();
  }

  public ngOnDestroy(): void {
    this.unsubscribeOpenSubscriptions();
  }
  //#endregion Framework Hooks

  //#region Private Event Handlers
  private handleHydrate(_event?: PaymentEventHydrate): void {
    const fetchDatasubscription = forkJoin([
      this.paymentRepo.fetchPaymentMethods(),
      this.paymentRepo.fetchPaymentHistory(),
    ]).subscribe((res) => {
      (res[0] && res[1]).either(
        () => {
          this.updateDataStreamOnActions();
        },
        (_error) => {
          this.stateStream.next(new PaymentStateError());
        }
      );
    });

    this.openSubscriptions.push(fetchDatasubscription);
  }

  private handleManagePaymentMethod(
    _event: PaymentEventManagePaymentMethod
  ): void {
    this.route.navigateByUrl('payment/manage');
  }

  private handleGotoSubscriptions(_event: PaymentEventGotoSubscriptions): void {
    this.route.navigateByUrl('./plans');
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

  private getDefaultMethod(): PaymentMethodModel[] {
    return this.paymentRepo.paymentMethodsSnapshot.filter(
      (x) => x.primaryMethod
    );
  }

  private onConnectivityChanged(isConnected: boolean): void {
    if (isConnected) {
      if (
        this.stateStream?.value?.name ==
        PaymentStateName.PaymentStateDisconnected
      ) {
        if (!this.isErrorState) {
          this.stateStream.next(
            new PaymentStateReady(
              this.paymentRepo.paymentHistorySnapshot,
              this.getDefaultMethod()
            )
          );
        } else {
          this.stateStream.next(new PaymentStateError());
        }
      }
    } else {
      this.stateStream.next(new PaymentStateDisconnected());
    }
  }

  private handleIncomingEvents(event: PaymentEvent): void {
    if (!event) {
      return;
    }

    switch (event.name) {
      case PaymentEventName.PaymentEventHydrate:
        this.handleHydrate(event as PaymentEventHydrate);
        break;
      case PaymentEventName.PaymentEventManagePaymentMethod:
        this.handleManagePaymentMethod(
          event as PaymentEventManagePaymentMethod
        );
        break;
      case PaymentEventName.PaymentEventGotoSubscriptions:
        this.handleGotoSubscriptions(event as PaymentEventGotoSubscriptions);
        break;
    }
  }

  private updateDataStreamOnActions(): void {
    if (!this.paymentMethodsSubscription$) {
      this.paymentMethodsSubscription$ =
        this.paymentRepo.paymentMethods$.subscribe(() => {
          this.stateStream.next(
            new PaymentStateReady(
              this.paymentRepo.paymentHistorySnapshot,
              this.getDefaultMethod()
            )
          );
        });

      this.openSubscriptions.push(this.paymentMethodsSubscription$);
    }
  }

  //#endregion Private Methods
}
