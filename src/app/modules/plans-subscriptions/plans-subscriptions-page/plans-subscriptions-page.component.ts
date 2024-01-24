import { PlansSubscriptionsBloc } from './../../../core/bloc/plans-subscriptions/plans-subscriptions.bloc';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import SwiperCore, { SwiperOptions, Navigation, Pagination } from 'swiper';
import { subscriptionsSwiper } from '../../../shared/configs/swiper-configs';
import {
  CancelSubscriptionEvent,
  DiscoverPlansEvent,
  PlansSubscriptionsEventHydrate,
  PlansSubscriptionsState,
  PlansSubscriptionsStateName,
  PlansSubscriptionsStateReady,
  ViewPlanDetailsEvent,
} from './../../../core/bloc/plans-subscriptions/plans-subscriptions.bloc-model';
import { Title } from '@angular/platform-browser';
SwiperCore.use([Navigation, Pagination]);
@Component({
  selector: 'app-plans-subscriptions-page',
  templateUrl: './plans-subscriptions-page.component.html',
  styleUrls: ['./plans-subscriptions-page.component.scss'],
  providers: [PlansSubscriptionsBloc],
})
export class PlansSubscriptionsPageComponent {
  //#region Private Data Members
  private openSubscriptions: Subscription[] = [];
  //#endregion Private Data Members

  //#region Public Data Members
  public viewState: PlansSubscriptionsState;
  public PlansSubscriptionsStateName = PlansSubscriptionsStateName;
  public PlansSubscriptionsStateReady = PlansSubscriptionsStateReady;
  public subscriptionsSwiper: SwiperOptions = subscriptionsSwiper;
  //#endregion Public Data Members

  //#region Framework Hooks
  constructor(
    private title: Title,
    private PlansSubscriptionsBloc: PlansSubscriptionsBloc
  ) {}

  public ngOnInit(): void {
    this.title.setTitle('Twist Account Mgt. | Plans & Subscriptions');
    this.getBlocState();
    this.registerBlocEvent();
  }

  public ngOnDestroy(): void {
    this.unsubscribeOpenSubscriptions();
  }
  //#endregion Framework Hooks

  //#region Private Methods
  private unsubscribeOpenSubscriptions(): void {
    if (this.openSubscriptions.length) {
      this.openSubscriptions.forEach((sub) => sub.unsubscribe());
    }
  }
  //#endregion Private Methods

  //#region Public Events Methods
  public onRetry(): void {
    this.PlansSubscriptionsBloc.events.next(
      new PlansSubscriptionsEventHydrate()
    );
  }

  public goToDiscoverPlans(serviceType?: string) {
    this.PlansSubscriptionsBloc.events.next(
      new DiscoverPlansEvent(serviceType)
    );
  }

  public goViewPlanDetails(serviceType?: string, categoryID?: string) {
    this.PlansSubscriptionsBloc.events.next(
      new ViewPlanDetailsEvent(serviceType, categoryID)
    );
  }

  public onCancelSubscription(bundleID?: string, bundleName?: string): void {
    this.PlansSubscriptionsBloc.events.next(
      new CancelSubscriptionEvent(bundleID, bundleName)
    );
  }
  //#endregion Public Events Methods

  //#region Private Bloc Methods
  private registerBlocEvent(): void {
    this.PlansSubscriptionsBloc.events.next(
      new PlansSubscriptionsEventHydrate()
    );
  }

  private getBlocState(): void {
    const blocStateSubscription = this.PlansSubscriptionsBloc.states$.subscribe(
      (data) => {
        this.viewState = data;
      }
    );

    this.openSubscriptions.push(blocStateSubscription);
  }
  //#endregion Private Bloc Methods
}
