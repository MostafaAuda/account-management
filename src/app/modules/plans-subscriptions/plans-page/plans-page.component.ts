import { Component } from '@angular/core';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { planTabsSwiperConfigs } from '../../../shared/configs/swiper-configs';
import {
  ChangeCategoryEvent,
  PlansEventHydrate,
  PlansState,
  PlansStateName,
  PlansStateReady,
  SubscribeEvent,
  UnsubscribeEvent,
} from './../../../core/bloc/plans/plans.bloc-model';
import { PlansBloc } from 'src/app/core/bloc/plans/plans.bloc';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-plans-page',
  templateUrl: './plans-page.component.html',
  styleUrls: ['./plans-page.component.scss'],
  providers: [PlansBloc],
})
export class PlansPageComponent {
  //#region Private Data Members
  private openSubscriptions: Subscription[] = [];
  //#endregion Private Data Members

  //#region Public Data Members
  public planTabsSwiper: SwiperOptions = planTabsSwiperConfigs;
  public viewState: PlansState;
  public PlansStateName = PlansStateName;
  public PlansStateReady = PlansStateReady;
  //#endregion Public Data Members

  //#region Framework Hooks
  constructor(private title: Title, private PlansBloc: PlansBloc) {}

  public ngOnInit(): void {
    this.title.setTitle('Twist Account Mgt. | Plans');
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
    this.PlansBloc.events.next(new PlansEventHydrate());
  }

  public onFilterCategory(id: string): void {
    this.PlansBloc.events.next(new ChangeCategoryEvent(id));
  }

  public onPlanSubscribe(planID?: string, planType?: string): void {
    this.PlansBloc.events.next(new SubscribeEvent(planID, planType));
  }

  public onPlanUnsubscribe(planID?: string, planType?: string): void {
    this.PlansBloc.events.next(new UnsubscribeEvent(planID, planType));
  }
  //#endregion Public Events Methods

  //#region Private Bloc Methods
  private registerBlocEvent(): void {
    this.PlansBloc.events.next(new PlansEventHydrate());
  }

  private getBlocState(): void {
    const blocStateSubscription = this.PlansBloc.states$.subscribe((data) => {
      this.viewState = data;
    });

    this.openSubscriptions.push(blocStateSubscription);
  }
  //#endregion Private Bloc Methods
}
