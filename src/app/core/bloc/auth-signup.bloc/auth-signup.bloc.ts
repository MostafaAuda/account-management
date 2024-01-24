import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { SignupData } from '../../models/auth.model';
import {
  AuthenticationServiceContract,
  AuthEntryData,
} from '../.contracts/services/auth.service-contract';
import {
  SignupEvent,
  UserSignupEvent,
  SignupEventName,
  BackToVerificationEvent,
} from './auth-signup.bloc-model';

@Injectable()
export class SignupBloc implements OnDestroy {
  //#region Public data members
  public events = new Subject<SignupEvent>();
  //#endregion Public data members

  //#region Private data members
  private userEntryData: AuthEntryData;
  private openSubscriptions: Subscription[] = [];
  //#endregion Private data members

  //#region Framework Hooks
  constructor(
    private authService: AuthenticationServiceContract,
    private router: Router
  ) {
    this.subscribeViewEvents();
    this.getUserEntryData();
  }

  public ngOnDestroy(): void {
    this.unsubscribeOpenSubscriptions();
  }
  //#endregion Framework Hooks

  //#region Private Methods
  private getUserEntryData(): void {
    const userEntryDataSubscription = this.authService.authEntryData$.subscribe(
      (res: AuthEntryData) => {
        this.userEntryData = res;
      }
    );
    this.openSubscriptions.push(userEntryDataSubscription);
  }

  private subscribeViewEvents(): void {
    const eventsSubscription = this.events.subscribe((event) =>
      this.handleIncomingEvents(event)
    );
    this.openSubscriptions.push(eventsSubscription);
  }

  private unsubscribeOpenSubscriptions(): void {
    if (this.openSubscriptions.length) {
      this.openSubscriptions.forEach((sub) => sub.unsubscribe());
    }
  }
  //#endregion Private Methods

  //#region Private Event handlers
  private handleUserSignupEvent(_event: UserSignupEvent): void {
    let payload: SignupData = {
      mail: this.userEntryData.entryID.toString(),
      password: _event.password,
    };
    console.log(payload);
  }

  private handleBackToVerificationEvent(_event: BackToVerificationEvent): void {
    this.authService.resetUserEntryData();
    this.router.navigateByUrl('auth');
  }

  private handleIncomingEvents(event: SignupEvent): void {
    if (!event) {
      return;
    }

    switch (event.name) {
      case SignupEventName.UserSignupEvent:
        this.handleUserSignupEvent(event as UserSignupEvent);
        break;
      case SignupEventName.BackToVerificationEvent:
        this.handleBackToVerificationEvent(event as BackToVerificationEvent);
        break;
    }
  }
  //#endregion Private Event handlers
}
