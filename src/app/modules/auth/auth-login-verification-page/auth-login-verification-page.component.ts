import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  EntryType,
} from 'src/app/core/bloc/.contracts/services/auth.service-contract';
import { LoginVerificationBloc } from 'src/app/core/bloc/auth-login-verification.bloc/auth-login-verification.bloc';
import { LoginEvent } from 'src/app/core/bloc/auth-login-verification.bloc/auth-login-verification.bloc-model';

@Component({
  selector: 'app-login-verification-page',
  templateUrl: './auth-login-verification-page.component.html',
  styleUrls: ['./auth-login-verification-page.component.scss'],
  providers: [LoginVerificationBloc],
})
export class AuthLoginVerificationPageComponent implements OnInit, OnDestroy {
  //#region Public data members
  @ViewChild('emailPhoneInput', { static: false }) emailPhoneInput!: ElementRef;
  public startValidating: boolean = false;
  public formError: string = '';
  public is_submitting: boolean = false;
  public loginVerificationForm!: FormGroup;
  public activePhoneValidation: boolean = false;
  public activeEmailValidation: boolean = false;
  //#endregion Public data members

  //#region Private data members
  private openSubscriptions: Subscription[] = [];
  //#endregion Private data members

  //#region Framwork hooks
  constructor(
    private formBuilder: FormBuilder,
    private LoginVerificationBloc: LoginVerificationBloc,
    private authService: AuthenticationServiceContract,
    private title: Title
  ) {}

  public ngOnInit(): void {
    this.title.setTitle('Twist Account Management');
    this.buildLoginVerificationForm();
  }

  public ngOnDestroy(): void {
    this.resetLoginForm();
    this.unsubscribeOpenSubscriptions();
  }
  //#endregion Framwork hooks

  //#region Public Methods
  //Convenience getter for easy access to form fields
  public get loginVerificationFormControls(): {
    [key: string]: AbstractControl;
  } {
    return this.loginVerificationForm?.controls;
  }

  public validateLoginType(): void {
    const controlValue =
      this.loginVerificationFormControls['emailnphone'].value;

    //Regex to check phone numbers
    const phonePattern = new RegExp(/^01[0,1,2,5]{1}/);

    if (controlValue?.length == 0) {
      this.resetLoginForm();
    }

    if (controlValue?.length > 2) {
      this.startValidating = true;

      if (phonePattern.test(controlValue)) {
        this.PhoneValidation();
        return;
      }

      if (!phonePattern.test(controlValue)) {
        this.EmailValidation();
        return;
      }
    }
  }

  public allowNumbersOnly(key: KeyboardEvent): void {
    if (!this.activePhoneValidation) {
      return;
    }

    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(key.keyCode);
    if (key.keyCode != 8 && !pattern.test(inputChar)) {
      key.preventDefault();
    }
  }

  public verifyLoginType(): void {
    //Stop here if form is invalid
    if (this.loginVerificationForm?.invalid) {
      return;
    }

    let loginVerificationID =
      this.loginVerificationFormControls['emailnphone'].value;

    if (this.activeEmailValidation) {
      this.LoginVerificationBloc.events.next(
        new LoginEvent({
          entryID: loginVerificationID,
          entryType: EntryType.email,
        })
      );
      return;
    }

    if (this.activePhoneValidation) {
      this.LoginVerificationBloc.events.next(
        new LoginEvent({
          entryID: loginVerificationID,
          entryType: EntryType.phone,
        })
      );
      return;
    }
  }

  public submitListen(key: KeyboardEvent): void {
    if (key.keyCode == 13) {
      this.verifyLoginType();
    }
  }
  //#endregion Public methods

  //#region Private Methods
  private buildLoginVerificationForm(): void {
    this.getFormError();
    this.getUserSubmissionStatus();

    this.loginVerificationForm = this.formBuilder.group({
      emailnphone: [null, [Validators.required, Validators.minLength(3)]],
    });
  }

  private PhoneValidation(): void {
    this.activeEmailValidation = false;
    this.activePhoneValidation = true;

    //Add node attributes validations
    this.emailPhoneInput?.nativeElement.setAttribute('maxlength', '11');
    this.emailPhoneInput?.nativeElement.setAttribute('minlength', '11');
    this.emailPhoneInput?.nativeElement.setAttribute(
      'pattern',
      '01[0,1,2,5]{1}[0-9]{8}'
    );

    //Add form validations
    this.loginVerificationFormControls['emailnphone'].setValidators([
      Validators.maxLength(11),
      Validators.minLength(11),
      Validators.pattern(/01[0,1,2,5]{1}[0-9]{8}/),
    ]);
    this.loginVerificationFormControls['emailnphone'].updateValueAndValidity();
  }

  private EmailValidation(): void {
    this.activePhoneValidation = false;
    this.activeEmailValidation = true;

    //Add form validations
    this.loginVerificationFormControls['emailnphone'].setValidators([
      Validators.email,
    ]);

    this.loginVerificationFormControls['emailnphone'].updateValueAndValidity();
  }

  private resetLoginForm(): void {
    this.loginVerificationForm?.reset();

    //Reset validations
    this.activePhoneValidation = false;
    this.activeEmailValidation = false;
    this.startValidating = false;

    this.emailPhoneInput?.nativeElement.removeAttribute('maxlength');
    this.emailPhoneInput?.nativeElement.removeAttribute('minlength');
    this.emailPhoneInput?.nativeElement.removeAttribute('pattern');

    this.loginVerificationFormControls['emailnphone'].clearValidators();
    this.loginVerificationFormControls['emailnphone'].setValidators([
      Validators.required,
      Validators.minLength(3),
    ]);
    this.loginVerificationFormControls['emailnphone'].updateValueAndValidity();
  }

  private unsubscribeOpenSubscriptions(): void {
    if (this.openSubscriptions.length) {
      this.openSubscriptions.forEach((sub) => sub.unsubscribe());
    }
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
  //#endregion Private Service methods
}
