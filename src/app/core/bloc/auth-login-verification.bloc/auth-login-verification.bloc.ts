import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import {
  customErrorException,
  Result,
} from '../../models/.common/result.model';
import { AuthResponseModel } from '../../models/auth.model';
import { AuthRepoContract } from '../.contracts/repos/auth.repo-contract';
import {
  AuthenticationServiceContract,
  AuthEntryData,
  EntryType,
} from '../.contracts/services/auth.service-contract';
import { LoadingSpinnerServiceContract } from '../.contracts/services/loading-spinner.service-contract';
import {
  LoginEvent,
  LoginVerificationEvent,
  LoginVerificationEventName,
} from './auth-login-verification.bloc-model';

@Injectable()
export class LoginVerificationBloc implements OnDestroy {
  //#region Public data members
  public events = new Subject<LoginVerificationEvent>();
  //#endregion Public data members

  //#region Private data members
  private openSubscriptions: Subscription[] = [];
  //#endregion Private data members

  //#region Framework Hooks
  constructor(
    private authService: AuthenticationServiceContract,
    private route: Router,
    private loadingSpinner: LoadingSpinnerServiceContract,
    private authRepo: AuthRepoContract,
    private translateService: TranslateService
  ) {
    this.subscribeViewEvents();
  }

  public ngOnDestroy(): void {
    this.unsubscribeOpenSubscriptions();
  }
  //#endregion Framework Hooks

  //#region Private Methods
  private saveAuthEntryData(_event: LoginEvent): void {
    let authEntryData: AuthEntryData = {
      entryID: _event.AuthEntryData.entryID,
      entryType: _event.AuthEntryData.entryType,
    };

    this.authService.authEntryDataStream.next(authEntryData);
  }

  private loginBymail(_event: LoginEvent): void {
    let mail = _event.AuthEntryData.entryID.toString();

    //Start UI loader
    this.loadingSpinner.showLoader();

    //Disable the submit button
    this.authService.isUserSubmittingStream.next(true);

    this.authRepo
      .checkMailExistence(mail)
      .subscribe((res: Result<AuthResponseModel>) =>
        res.either(
          (data: AuthResponseModel) => {
            //After Success
            if (data?.twistStatusCode == 1) {
              this.route.navigateByUrl('auth/signin');
            }

            if (data?.twistStatusCode == 2) {
              this.route.navigateByUrl('auth/signup');
            }

            //End UI loader
            this.loadingSpinner.hideLoader();

            //Enable the submit button back on
            this.authService.isUserSubmittingStream.next(false);
          },
          () => {
            //After Error
            this.authService.formErrorStream.next(
              this.translateService.instant(
                'Something went wrong, please try again'
              )
            );
            //End UI loader
            this.loadingSpinner.hideLoader();

            //Enable the submit button back on
            this.authService.isUserSubmittingStream.next(false);
          }
        )
      );
  }

  private loginByPhone(_event: LoginEvent): void {
    let phoneNumber = _event.AuthEntryData.entryID.toString();

    //Start UI loader
    this.loadingSpinner.showLoader();

    //Disable the submit button
    this.authService.isUserSubmittingStream.next(true);

    this.authRepo
      .sendOtp(phoneNumber)
      .subscribe((res: Result<AuthResponseModel>) =>
        res.either(
          () => {
            //After Success
            this.route.navigateByUrl('auth/signin');

            //End UI loader
            this.loadingSpinner.hideLoader();

            //Enable the submit button back on
            this.authService.isUserSubmittingStream.next(false);
          },
          (error: customErrorException) => {
            switch (error?.error?.fault?.baseCode) {
              case 400:
                this.authService.formErrorStream.next(
                  this.translateService.instant(
                    'Failed to send verification code, please try again'
                  )
                );
                break;
              case 406:
                this.authService.formErrorStream.next(
                  this.translateService.instant(
                    'The number of attempts to send the verification code has been exceeded, try again later'
                  )
                );
                break;
              default:
                this.authService.formErrorStream.next(
                  this.translateService.instant(
                    'Something went wrong, please try again'
                  )
                );
                break;
            }

            //End UI loader
            this.loadingSpinner.hideLoader();

            //Enable the submit button back on
            this.authService.isUserSubmittingStream.next(false);
          }
        )
      );
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
  private handleLogin(_event: LoginEvent): void {
    this.saveAuthEntryData(_event);

    let entryType = _event.AuthEntryData.entryType;

    if (entryType == EntryType.email) {
      this.loginBymail(_event);
      return;
    }

    if (entryType == EntryType.phone) {
      this.loginByPhone(_event);
      return;
    }
  }

  private handleIncomingEvents(event: LoginVerificationEvent): void {
    if (!event) {
      return;
    }

    switch (event.name) {
      case LoginVerificationEventName.LoginEvent:
        this.handleLogin(event as LoginEvent);
        break;
    }
  }
  //#endregion Private Event handlers
}
