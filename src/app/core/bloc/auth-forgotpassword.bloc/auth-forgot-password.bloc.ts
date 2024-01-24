import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { ForgotPasswordData } from '../../models/auth.model';
import {
  AuthenticationServiceContract,
  AuthEntryData,
} from '../.contracts/services/auth.service-contract';
import {
  UserForgotPasswordEvent,
  ForgotPasswordEvent,
  ForgotPasswordEventName,
} from './auth-forgot-password.bloc-model';

@Injectable()
export class ForgotPasswordBloc implements OnDestroy {
  //#region Public data members
  public events = new Subject<ForgotPasswordEvent>();
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
  private handleUserForgotPasswordEvent(_event: UserForgotPasswordEvent): void {
    let payload: ForgotPasswordData = {
      mail: this.userEntryData.entryID.toString(),
      password: _event.password,
    };
    console.log(payload);
    this.router.navigateByUrl('auth');
  }

  private handleIncomingEvents(event: ForgotPasswordEvent): void {
    if (!event) {
      return;
    }

    switch (event.name) {
      case ForgotPasswordEventName.UserForgotPasswordEvent:
        this.handleUserForgotPasswordEvent(event as UserForgotPasswordEvent);
        break;
    }
  }
  //#endregion Private Event handlers
}
