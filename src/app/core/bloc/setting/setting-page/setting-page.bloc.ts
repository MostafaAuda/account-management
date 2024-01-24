import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { AuthenticationServiceContract } from '../../.contracts/services/auth.service-contract';
import { ConnectivityServiceContract } from '../../.contracts/services/connectivity.service-contract';
import {
  AppLang,
  LocalizationServiceContract,
} from '../../.contracts/services/localization.service-contract';
import { ConnectedState } from '../change-password/change-password.bloc-model';
import {
  GoToUpdateInfoEvent,
  ConnectWithAppleEvent,
  ConnectWithFbEvent,
  ConnectWithGoogleEvent,
  SettingEvents,
  SettingEventsName,
  SettingStates,
  GoToChangePasswordEvent,
  SwitchLangEvent,
  EnLangState,
  ArLangState,
  DisconnectedState,
  SettingStatesName,
} from './setting-page.bloc-model';
@Injectable()
export class SettingPageBloc {
  //#region Private Data Members
  private openSubscriptions: Subscription[] = [];
  //#endregion Private Data Members

  //#region Public Data Members
  public stateStream = new BehaviorSubject<SettingStates>(EnLangState);
  public get states$(): Observable<SettingStates> {
    return this.stateStream.asObservable();
  }
  public events = new Subject<SettingEvents>();
  //#endregion Public Data Members

  //#region Framework Hooks
  constructor(
    private route: Router,
    private _LocalizationService: LocalizationServiceContract,
    private connectivityService: ConnectivityServiceContract,
    private authService: AuthenticationServiceContract
  ) {
    this.subscribeViewEvents();
    this.getCurrentAppLang();
    this.checkConnectivityStatus();
  }

  ngOnDestroy(): void {
    this.unsubscribeOpenSubscriptions();
  }
  //#endregion Framework Hooks

  //#region Private Event Handlers
  private handleConnectWithApple(event: ConnectWithAppleEvent): void {
    console.log(event);
  }

  private handleConnectWithFB(event: ConnectWithFbEvent): void {
    console.log(event);
  }

  private handleConnectWithGoogle(event: ConnectWithGoogleEvent): void {
    console.log(event);
  }

  private handleSignOut(): void {
    this.authService.revokeAuthentication();
  }

  private handleSwitchLang(_event: SwitchLangEvent): void {
    switch (_event.data) {
      case AppLang.ar:
        this._LocalizationService.setLangAr();
        break;

      case AppLang.en:
        this._LocalizationService.setLangEn();
        break;

      default:
        break;
    }
  }

  private handleUpdateInfo(_event: GoToUpdateInfoEvent): void {
    this.route.navigateByUrl('setting/updateUserInfo');
  }

  private handleChangePassword(_event: GoToChangePasswordEvent): void {
    this.route.navigateByUrl('setting/changePassword');
  }
  //#endregion Private Event Handlers

  //#region Private Methods
  private handleIncomingEvents(event: SettingEvents): void {
    if (!event) {
      return;
    }
    switch (event.name) {
      case SettingEventsName.ConnectWithApple:
        this.handleConnectWithApple(event as ConnectWithAppleEvent);
        break;
      case SettingEventsName.ConnectWithFacebook:
        this.handleConnectWithFB(event as ConnectWithFbEvent);
        break;
      case SettingEventsName.ConnectWithFacebook:
        this.handleConnectWithGoogle(event as ConnectWithGoogleEvent);
        break;
      case SettingEventsName.SwitchLang:
        this.handleSwitchLang(event as SwitchLangEvent);
        break;
      case SettingEventsName.GoToUpdateInfo:
        this.handleUpdateInfo(event as GoToUpdateInfoEvent);
        break;
      case SettingEventsName.GoToChangePassword:
        this.handleChangePassword(event as GoToChangePasswordEvent);
        break;
      case SettingEventsName.Signout:
        this.handleSignOut();
        break;
    }
  }

  private getCurrentAppLang(): void {
    //Get current app language
    const langSubscription = this._LocalizationService?.currentLang$?.subscribe(
      (res: AppLang) => {
        if (res == AppLang.ar) {
          this.stateStream.next(new ArLangState());
          return;
        }

        if (res == AppLang.en) {
          this.stateStream.next(new EnLangState());
          return;
        }
      }
    );
    this.openSubscriptions.push(langSubscription);
  }

  private unsubscribeOpenSubscriptions(): void {
    if (this.openSubscriptions?.length) {
      this.openSubscriptions?.forEach((sub) => sub?.unsubscribe());
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
        this.stateStream?.value?.name === SettingStatesName.DisconnectedState
      ) {
        this.stateStream.next(new ConnectedState());
      }
    } else {
      this.stateStream.next(new DisconnectedState());
    }
  }
  //#endregion Private Methods
}
