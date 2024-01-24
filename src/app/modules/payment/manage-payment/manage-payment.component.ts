import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ManagePaymentBloc } from 'src/app/core/bloc/manage-payment/manage-payment.bloc';
import {
  ManagePaymentEventAddMethod,
  ManagePaymentEventHydrate,
  ManagePaymentEventRemoveMethod,
  ManagePaymentEventSetDefault,
  ManagePaymentState,
  ManagePaymentStateName,
  ManagePaymentStateProcessing,
  ManagePaymentStateReady,
} from 'src/app/core/bloc/manage-payment/manage-payment.bloc-model';

@Component({
  selector: 'app-manage-payment',
  templateUrl: './manage-payment.component.html',
  styleUrls: ['./manage-payment.component.scss'],
  providers: [ManagePaymentBloc],
})
export class ManagePaymentComponent implements OnInit {
  //#region Private Data Members
  private openSubscriptions: Subscription[] = [];
  //#endregion Private Data Members

  //#region Public Data Members
  public viewState: ManagePaymentState = new ManagePaymentStateProcessing();
  public ManagePaymentStateName = ManagePaymentStateName;
  public ManagePaymentStateReady = ManagePaymentStateReady;
  //#endregion Public Data Members

  //#region Framwork Hooks
  constructor(
    private title: Title,
    private managePaymentBloc: ManagePaymentBloc
  ) {}
  ngOnInit(): void {
    this.title.setTitle('Twist Account Mgt. | Payments');
    this.getBlocState();
    this.registerBlocEvent();
  }

  public ngOnDestroy(): void {
    this.unsubscribeOpenSubscriptions();
  }
  //#endregion Framwork Hooks

  //#region Private Bloc Methods
  private getBlocState(): void {
    const blockEventsSubscription = this.managePaymentBloc.states$.subscribe(
      (data) => {
        this.viewState = data;
      }
    );
    this.openSubscriptions.push(blockEventsSubscription);
  }

  private registerBlocEvent(): void {
    this.managePaymentBloc.events.next(new ManagePaymentEventHydrate());
  }
  //#endregion Private Bloc Methods

  //#region Private Methods
  private unsubscribeOpenSubscriptions(): void {
    if (this.openSubscriptions.length) {
      this.openSubscriptions.forEach((sub) => sub.unsubscribe());
    }
  }
  //#endregion Private Methods

  //#region Public Events Methods
  public goToPayment(): void {
    this.managePaymentBloc.events.next(new ManagePaymentEventAddMethod());
  }

  public onRemovePaymentMethod(paymentId: string, creationDate: Date): void {
    this.managePaymentBloc.events.next(
      new ManagePaymentEventRemoveMethod(paymentId, creationDate)
    );
  }

  public onSetDefault(Id: string, creationDate: Date): void {
    this.managePaymentBloc.events.next(
      new ManagePaymentEventSetDefault(Id, creationDate)
    );
  }

  public onRetry(): void {
    this.managePaymentBloc.events.next(new ManagePaymentEventHydrate());
  }
  //#endregion Public Events Methods
}
