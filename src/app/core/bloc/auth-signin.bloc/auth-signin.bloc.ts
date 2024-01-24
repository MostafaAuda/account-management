import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import {
  customErrorException,
  Result,
} from '../../models/.common/result.model';
import {
  LoginByPhoneData,
  LoginByMailData,
  AuthResponseModel,
} from '../../models/auth.model';
import { AuthRepoContract } from '../.contracts/repos/auth.repo-contract';
import {
  AuthenticationServiceContract,
  AuthEntryData,
  EntryType,
} from '../.contracts/services/auth.service-contract';
import { LoadingSpinnerServiceContract } from '../.contracts/services/loading-spinner.service-contract';
import {
  BackToVerificationEvent,
  CheckLoginTypeEvent,
  CheckLoginTypeState,
  ForgotPasswordEvent,
  LoginByMailEvent,
  LoginByMailState,
  LoginByPhoneEvent,
  LoginByPhoneState,
  ResendOTPEvent,
  SigninEvent,
  SigninEventName,
  SigninState,
  VerifyMailEvent,
  VerifyMailState,
} from './auth-signin.bloc-model';

@Injectable()
export class SigninBloc implements OnDestroy {
  //#region Public data members
  public get states$(): Observable<SigninState> {
    return this.stateStream.asObservable();
  }
  public events = new Subject<SigninEvent>();
  //#endregion Public data members

  //#region Private data members
  private userEntryData: AuthEntryData;
  private stateStream = new BehaviorSubject<SigninState>(
    new CheckLoginTypeState()
  );
  private openSubscriptions: Subscription[] = [];
  //#endregion Private data members

  //#region Framework Hooks
  constructor(
    private authService: AuthenticationServiceContract,
    private router: Router,
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
  private changeStateBasedOnLoginType(userEntryData: AuthEntryData): void {
    if (userEntryData.entryType == EntryType.email) {
      this.stateStream.next(new LoginByMailState());
      return;
    }

    if (userEntryData.entryType == EntryType.phone) {
      this.stateStream.next(new LoginByPhoneState());
      return;
    }
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
  private handleResendOTPEvent(_event: ResendOTPEvent): void {
    console.log(_event);
  }

  private handleBackToVerificationEvent(_event: BackToVerificationEvent): void {
    this.authService.resetUserEntryData();
    this.router.navigateByUrl('auth');
  }

  private handleForgotPasswordEvent(_event: ForgotPasswordEvent): void {
    this.router.navigateByUrl('auth/forgot-password');
  }

  private handleVerifyMailEvent(_event: VerifyMailEvent): void {
    this.stateStream.next(new VerifyMailState());
  }

  private handleLoginByPhoneEvent(_event: LoginByPhoneEvent): void {
    let payload: LoginByPhoneData = {
      phone: +this.userEntryData.entryID,
      otp: _event.otp,
    };
    console.log(payload);
  }

  private handleLoginByMailEvent(_event: LoginByMailEvent): void {
    //Prepare the payload data
    let payload: LoginByMailData = {
      mail: this.userEntryData.entryID.toString(),
      password: _event.password,
    };

    //Start UI loader
    this.loadingSpinner.showLoader();

    //Disable the submit button
    this.authService.isUserSubmittingStream.next(true);

    this.authRepo
      .loginByMail(payload)
      .subscribe((res: Result<AuthResponseModel>) =>
        res.either(
          (data: AuthResponseModel) => {
            //After Success
            this.authService.authenticateUser(data);

            //End UI loader
            this.loadingSpinner.hideLoader();

            //Enable the submit button back on
            this.authService.isUserSubmittingStream.next(false);
          },
          (error: customErrorException) => {
            //After Error
            switch (error?.error?.fault?.baseCode) {
              case 400:
                this.authService.formErrorStream.next(
                  this.translateService.instant(
                    'Wrong credentials, please try again'
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

  private handleCheckLoginTypeEvent(_event: CheckLoginTypeEvent): void {
    const loginTypeSubscription = this.authService.authEntryData$.subscribe(
      (userEntryData: AuthEntryData) => {
        this.userEntryData = userEntryData;
        this.changeStateBasedOnLoginType(userEntryData);
      }
    );

    this.openSubscriptions.push(loginTypeSubscription);
  }

  private handleIncomingEvents(event: SigninEvent): void {
    if (!event) {
      return;
    }

    switch (event.name) {
      case SigninEventName.CheckLoginTypeEvent:
        this.handleCheckLoginTypeEvent(event as CheckLoginTypeEvent);
        break;
      case SigninEventName.LoginByMailEvent:
        this.handleLoginByMailEvent(event as LoginByMailEvent);
        break;
      case SigninEventName.LoginByPhoneEvent:
        this.handleLoginByPhoneEvent(event as LoginByPhoneEvent);
        break;
      case SigninEventName.VerifyMailEvent:
        this.handleVerifyMailEvent(event as VerifyMailEvent);
        break;
      case SigninEventName.ForgotPasswordEvent:
        this.handleForgotPasswordEvent(event as ForgotPasswordEvent);
        break;
      case SigninEventName.BackToVerificationEvent:
        this.handleBackToVerificationEvent(event as BackToVerificationEvent);
        break;
      case SigninEventName.ResendOTPEvent:
        this.handleResendOTPEvent(event as ResendOTPEvent);
        break;
    }
  }
  //#endregion Private Event handlers
}
