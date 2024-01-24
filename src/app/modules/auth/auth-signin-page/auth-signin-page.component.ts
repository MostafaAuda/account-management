import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NgOtpInputComponent, NgOtpInputConfig } from 'ng-otp-input';
import { Subscription } from 'rxjs';
import {
  AuthenticationServiceContract,
  AuthEntryData,
} from 'src/app/core/bloc/.contracts/services/auth.service-contract';
import { SigninBloc } from 'src/app/core/bloc/auth-signin.bloc/auth-signin.bloc';
import {
  BackToVerificationEvent,
  CheckLoginTypeEvent,
  ForgotPasswordEvent,
  LoginByMailEvent,
  LoginByPhoneEvent,
  ResendOTPEvent,
  SigninState,
  SigninStateName,
} from 'src/app/core/bloc/auth-signin.bloc/auth-signin.bloc-model';

@Component({
  selector: 'app-auth-signin-page',
  templateUrl: './auth-signin-page.component.html',
  styleUrls: ['./auth-signin-page.component.scss'],
  providers: [SigninBloc],
})
export class AuthSigninPageComponent implements OnInit, OnDestroy {
  //#region Public data members
  public userEntryData: AuthEntryData;

  //Form properties
  public formError: string = '';
  public is_submitting: boolean = false;
  public signinForm!: FormGroup;
  public showPassword: boolean = false;

  //OTP properties
  @ViewChild(NgOtpInputComponent, { static: false })
  ngOtpInput!: NgOtpInputComponent;

  public otpConfig: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    containerClass: 'otp-custom-container',
    inputClass: 'otp-custom-input',
  };

  public otpSettings: otpSettings = {
    resendOTP: false,
    seconds: 0,
    timer: null,
  };
  public otpError: string = '';

  //Bloc properties
  public viewState: SigninState;
  public SigninStateName = SigninStateName;
  //#endregion Public data members

  //#region Private data members
  private openSubscriptions: Subscription[] = [];
  //#endregion Private data members

  //#region Framwork hooks
  constructor(
    private formBuilder: FormBuilder,
    private SigninBloc: SigninBloc,
    private authService: AuthenticationServiceContract,
    private title: Title
  ) {}

  public ngOnInit(): void {
    this.title.setTitle('Twist Account Mgt. | Sign in');
    this.getBlocState();
    this.registerBlocEvent();
    this.getUserEntryData();
  }

  public ngOnDestroy(): void {
    this.resetOtpConfigs();
    this.resetSigninForm();
    this.unsubscribeOpenSubscriptions();
  }
  //#endregion Framwork hooks

  //#region Public Methods
  //Convenience getter for easy access to form fields
  public onShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  public get signinFormControls(): {
    [key: string]: AbstractControl;
  } {
    return this.signinForm?.controls;
  }

  public submitListen(key: KeyboardEvent): void {
    if (key.keyCode == 13) {
      this.onLoginByMail();
    }
  }
  //#endregion Public methods

  //#region Private Methods
  private buildSigninForm(): void {
    this.getFormError();
    this.getUserSubmissionStatus();

    this.signinForm = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(8)]],
    });
  }

  private resetSigninForm(): void {
    this.signinForm?.reset();
  }

  private unsubscribeOpenSubscriptions(): void {
    if (this.openSubscriptions.length) {
      this.openSubscriptions.forEach((sub) => sub.unsubscribe());
    }
  }

  //OTP methods
  private tryAgainOTP(): void {
    this.ngOtpInput?.setValue('');
    this.ngOtpInput?.otpForm?.enable();
  }

  private activateOTP(): void {
    this.resetOtpConfigs();
    this.otpSettings.timer = setInterval(() => {
      if (this.otpSettings.seconds == 0) {
        this.otpSettings.resendOTP = true;
        clearInterval(this.otpSettings.timer);
      } else {
        this.otpSettings.seconds--;
      }
    }, 1000);
  }

  private resetOtpConfigs() {
    this.ngOtpInput?.setValue('');
    this.ngOtpInput?.otpForm?.enable();
    this.otpSettings.resendOTP = false;
    this.otpSettings.seconds = 60;
    clearInterval(this.otpSettings.timer);
  }
  //#endregion Private methods

  //#region Private Service methods
  private getUserSubmissionStatus(): void {
    const isSubmittingSubscription =
      this.authService.isUserSubmitting$.subscribe((res: any) => {
        this.is_submitting = res;
      });

    this.openSubscriptions.push(isSubmittingSubscription);
  }

  private getFormError(): void {
    //Empty errors before subscription
    this.authService.formErrorStream.next('');

    const formErrorSubscription = this.authService.formErrorData$.subscribe(
      (res: any) => {
        this.formError = res;
      }
    );

    this.openSubscriptions.push(formErrorSubscription);
  }

  private getOTPError(): void {
    //Empty error before subscription
    this.authService.otpErrorStream.next('');

    const OTPErrorSubscription = this.authService.otpErrorData$.subscribe(
      (res: any) => {
        this.otpError = res;
        this.tryAgainOTP();
      }
    );

    this.openSubscriptions.push(OTPErrorSubscription);
  }

  private getUserEntryData(): void {
    const userEntryDataSubscription = this.authService.authEntryData$.subscribe(
      (res: AuthEntryData) => {
        this.userEntryData = res;
      }
    );
    this.openSubscriptions.push(userEntryDataSubscription);
  }
  //#endregion Private Service methods

  //#region Private Bloc methods
  private registerBlocEvent(): void {
    this.SigninBloc.events.next(new CheckLoginTypeEvent());
  }

  private getBlocState(): void {
    const blocStateSubscription = this.SigninBloc.states$.subscribe(
      (res: SigninState) => {
        this.viewState = res;

        if (this.viewState.name == SigninStateName.LoginByPhoneState) {
          this.activateOTP();
          this.getOTPError();
        }

        if (this.viewState.name == SigninStateName.LoginByMailState) {
          this.buildSigninForm();
        }
      }
    );
    this.openSubscriptions.push(blocStateSubscription);
  }
  //#endregion Private Bloc methods

  //#region Public Events methods
  public onLoginByMail(): void {
    let password = this.signinFormControls['password'].value;
    this.SigninBloc.events.next(new LoginByMailEvent(password));
  }

  public onBackToVerificationClick(): void {
    this.SigninBloc.events.next(new BackToVerificationEvent());
  }

  public onForgotPasswordClick(): void {
    this.SigninBloc.events.next(new ForgotPasswordEvent());
  }

  public onLoginByPhone(otp: string): void {
    if (otp.length == 6) {
      this.ngOtpInput?.otpForm?.disable();
      this.SigninBloc.events.next(new LoginByPhoneEvent(otp));
    }
  }

  public onResendOTP(): void {
    this.SigninBloc.events.next(new ResendOTPEvent());
    this.activateOTP();
  }
  //#endregion Public Events methods
}

export interface otpSettings {
  resendOTP: boolean;
  seconds: number;
  timer: any;
}
