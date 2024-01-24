import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import {
  AuthenticationServiceContract,
  AuthEntryData,
} from 'src/app/core/bloc/.contracts/services/auth.service-contract';
import { ForgotPasswordBloc } from 'src/app/core/bloc/auth-forgotpassword.bloc/auth-forgot-password.bloc';
import { UserForgotPasswordEvent } from 'src/app/core/bloc/auth-forgotpassword.bloc/auth-forgot-password.bloc-model';
import { PassswordsValidators } from 'src/app/core/helpers/passwords-validators';

@Component({
  selector: 'app-auth-forgot-password-page',
  templateUrl: './auth-forgot-password-page.component.html',
  styleUrls: ['./auth-forgot-password-page.component.scss'],
  providers: [ForgotPasswordBloc],
})
export class AuthForgotPasswordPageComponent implements OnInit, OnDestroy {
  //#region Public data members
  public userEntryData: AuthEntryData;

  //Form properties
  public formError: string = '';
  public is_submitting: boolean = false;
  public forgotPasswordForm!: FormGroup;
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  //#endregion Public data members

  //#region Private data members
  private openSubscriptions: Subscription[] = [];
  //#endregion Private data members

  //#region Framwork hooks
  constructor(
    private formBuilder: FormBuilder,
    private ForgotPasswordBloc: ForgotPasswordBloc,
    private authService: AuthenticationServiceContract,
    private title: Title
  ) {}

  public ngOnInit(): void {
    this.title.setTitle('Twist Account Mgt. | Forgot Password');
    this.getUserEntryData();
    this.buildForgotPasswordForm();
  }

  public ngOnDestroy(): void {
    this.resetForgotPasswordForm();
    this.unsubscribeOpenSubscriptions();
  }
  //#endregion Framwork hooks

  //#region Public Methods
  //Convenience getter for easy access to form fields
  public onShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  public onShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  public get forgotPasswordFormControls(): {
    [key: string]: AbstractControl;
  } {
    return this.forgotPasswordForm?.controls;
  }

  public submitListen(key: KeyboardEvent): void {
    if (key.keyCode == 13) {
      this.onUserForgetPassword();
    }
  }
  //#endregion Public methods

  //#region Private Methods
  private buildForgotPasswordForm(): void {
    this.getFormError();
    this.getUserSubmissionStatus();

    this.forgotPasswordForm = this.formBuilder.group({
      newPassword: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          //Simple pattern require one number, one upper case, one lower case
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/),
        ],
      ],
      confirmPassword: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          PassswordsValidators.matchValues('newPassword'),
        ],
      ],
    });
    this.subscribeOnNewPasswordControlChanges();
  }

  private resetForgotPasswordForm(): void {
    this.forgotPasswordForm?.reset();
  }

  private unsubscribeOpenSubscriptions(): void {
    if (this.openSubscriptions.length) {
      this.openSubscriptions.forEach((sub) => sub.unsubscribe());
    }
  }

  private subscribeOnNewPasswordControlChanges(): void {
    //Update validators on confirm password when password changes
    const newPasswordChangesSubscription = this.forgotPasswordFormControls[
      'newPassword'
    ]?.valueChanges.subscribe(() => {
      this.forgotPasswordFormControls[
        'confirmPassword'
      ]?.updateValueAndValidity();
    });

    this.openSubscriptions.push(newPasswordChangesSubscription);
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

  private getUserEntryData(): void {
    const userEntryDataSubscription = this.authService.authEntryData$.subscribe(
      (res: AuthEntryData) => {
        this.userEntryData = res;
      }
    );
    this.openSubscriptions.push(userEntryDataSubscription);
  }
  //#endregion Private Service methods

  //#region Public Events methods
  public onUserForgetPassword(): void {
    let password = this.forgotPasswordFormControls['newPassword'].value;
    this.ForgotPasswordBloc.events.next(new UserForgotPasswordEvent(password));
  }
  //#endregion Public Events methods
}
