import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { HomeBloc } from './../../../core/bloc/home/home.bloc';
import {
  DiscoverPlansEvent,
  HomeEventHydrate,
  HomeState,
  HomeStateName,
  HomeStateReady,
} from 'src/app/core/bloc/home/home.bloc-model';
import { platformType } from '../barcode-modal/barcode-modal.component';
import { UserInfo } from 'src/app/core/models/user.model';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  providers: [HomeBloc],
})
export class HomePageComponent implements OnInit {
  //#region Private Data Members
  private openSubscriptions: Subscription[] = [];
  //#endregion Private Data Members

  //#region Public Data Members
  public viewState: HomeState;
  public HomeStateName = HomeStateName;
  public HomeStateReady = HomeStateReady;
  public platformType = platformType;
  public userInfo: UserInfo;
  //#endregion Public Data Members

  //#region Framework Hooks
  constructor(private title: Title, private homeBloc: HomeBloc) {}

  public ngOnInit(): void {
    this.title.setTitle('Twist Account Mgt. | Homepage');
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
    this.homeBloc.events.next(new HomeEventHydrate());
  }

  public goToDiscoverPlans(serviceType?: string): void {
    this.homeBloc.events.next(new DiscoverPlansEvent(serviceType));
  }
  //#endregion Public Events Methods

  //#region Private Bloc Methods
  private registerBlocEvent(): void {
    this.homeBloc.events.next(new HomeEventHydrate());
  }

  private getBlocState(): void {
    const blocStateSubscription = this.homeBloc.states$.subscribe((data) => {
      this.viewState = data;
      this.userInfo = (this.viewState as HomeStateReady).userInfo;
    });

    this.openSubscriptions.push(blocStateSubscription);
  }
  //#endregion Private Bloc Methods
}
