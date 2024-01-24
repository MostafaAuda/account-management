import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import {
  AuthEntryData,
  AuthenticationServiceContract,
} from 'src/app/core/bloc/.contracts/services/auth.service-contract';
import { SignupBloc } from 'src/app/core/bloc/auth-signup.bloc/auth-signup.bloc';
import {
  BackToVerificationEvent,
  UserSignupEvent,
} from 'src/app/core/bloc/auth-signup.bloc/auth-signup.bloc-model';
import { PassswordsValidators } from 'src/app/core/helpers/passwords-validators';

@Component({
  selector: 'app-auth-signup-page',
  templateUrl: './auth-signup-page.component.html',
  styleUrls: ['./auth-signup-page.component.scss'],
  providers: [SignupBloc],
})
export class AuthSignupPageComponent implements OnInit, OnDestroy {
  //#region Public data members
  public userEntryData: AuthEntryData;

  //Form properties
  public formError: string = '';
  public is_submitting: boolean = false;
  public signupForm!: FormGroup;
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  //#endregion Public data members

  //#region Private data members
  private openSubscriptions: Subscription[] = [];
  //#endregion Private data members

  //#region Framwork hooks
  constructor(
    private formBuilder: FormBuilder,
    private SignupBloc: SignupBloc,
    private authService: AuthenticationServiceContract,
    private title: Title
  ) {}

  public ngOnInit(): void {
    this.title.setTitle('Twist Account Mgt. | Sign up');
    this.getUserEntryData();
    this.buildSignupForm();
  }

  public ngOnDestroy(): void {
    this.resetSignupForm();
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

  public get signupFormControls(): {
    [key: string]: AbstractControl;
  } {
    return this.signupForm?.controls;
  }

  public submitListen(key: KeyboardEvent): void {
    if (key.keyCode == 13) {
      this.onUserSignupEvent();
    }
  }
  //#endregion Public methods

  //#region Private Methods
  private buildSignupForm(): void {
    this.getFormError();
    this.getUserSubmissionStatus();

    this.signupForm = this.formBuilder.group({
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

  private resetSignupForm(): void {
    this.signupForm?.reset();
  }

  private unsubscribeOpenSubscriptions(): void {
    if (this.openSubscriptions.length) {
      this.openSubscriptions.forEach((sub) => sub.unsubscribe());
    }
  }

  private subscribeOnNewPasswordControlChanges(): void {
    //Update validators on confirm password when password changes
    const newPasswordChangesSubscription = this.signupFormControls[
      'newPassword'
    ]?.valueChanges.subscribe(() => {
      this.signupFormControls['confirmPassword']?.updateValueAndValidity();
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
  public onUserSignupEvent(): void {
    let password = this.signupFormControls['newPassword'].value;
    this.SignupBloc.events.next(new UserSignupEvent(password));
  }

  public onBackToVerificationClick(): void {
    this.SignupBloc.events.next(new BackToVerificationEvent());
  }
  //#endregion Public Events methods
}
