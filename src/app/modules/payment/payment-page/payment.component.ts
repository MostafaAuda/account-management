import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { PaymentBloc } from 'src/app/core/bloc/payment/payment.bloc';
import {
  PaymentEventGotoSubscriptions,
  PaymentEventHydrate,
  PaymentEventManagePaymentMethod,
  PaymentState,
  PaymentStateName,
  PaymentStateProcessing,
  PaymentStateReady,
} from 'src/app/core/bloc/payment/payment.bloc-model';
import { PaymentMethodModel } from 'src/app/core/models/payment.model';
import { subscriptionsSwiper } from 'src/app/shared/configs/swiper-configs';
import SwiperCore, { SwiperOptions, Navigation, Pagination } from 'swiper';
SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [PaymentBloc],
})
export class PaymentComponent implements OnInit {
  //#region Private Data Members
  private openSubscriptions: Subscription[] = [];
  //#endregion Private Data Members

  //#region Public Data Members
  public viewState: PaymentState = new PaymentStateProcessing();
  public PaymentStateName = PaymentStateName;
  public PaymentStateReady = PaymentStateReady;
  public plansCardsSwiperConfigs: SwiperOptions = subscriptionsSwiper;
  public method: PaymentMethodModel;
  //#endregion Public Data Members

  //#region Framwork Hooks
  constructor(private title: Title, private activityBloc: PaymentBloc) {}

  public ngOnInit(): void {
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
    const blockEventsSubscription = this.activityBloc.states$.subscribe(
      (data) => {
        this.viewState = data;
        this.method = (
          this.viewState as PaymentStateReady
        )?.paymentMethods?.[0];
      }
    );

    this.openSubscriptions.push(blockEventsSubscription);
  }
  private registerBlocEvent(): void {
    this.activityBloc.events.next(new PaymentEventHydrate());
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
  public onManagePayment(): void {
    this.activityBloc.events.next(new PaymentEventManagePaymentMethod());
  }

  public onRetry(): void {
    this.activityBloc.events.next(new PaymentEventHydrate());
  }

  public goToSubscriptions(): void {
    this.activityBloc.events.next(new PaymentEventGotoSubscriptions());
  }
  //#endregion Public Events Methods
}
