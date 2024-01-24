import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChangePasswordBloc } from 'src/app/core/bloc/setting/change-password/change-password.bloc';
import {
  ChangePasswordEvent,
  ChangePasswordStates,
  ChangePasswordStatesName,
} from 'src/app/core/bloc/setting/change-password/change-password.bloc-model';
import { PassswordsValidators } from '../../../core/helpers/passwords-validators';
@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss'],
  providers: [ChangePasswordBloc],
})
export class ChangePassComponent {
  //#region Public Data Members

  //#region declarations for hide and show pass
  public showOldPassword: boolean = true;
  public showNewPassword: boolean = true;
  public showConfirmPassword: boolean = true;
  //#endregion declarations for hide and show pass

  public is_submitting: boolean = false;
  public createPasswordForm!: FormGroup;
  public builderForm!: FormBuilder;
  public viewState!: ChangePasswordStates;
  public changePasswordStatesName = ChangePasswordStatesName;
  //#endregion Public Data Members

  //#region Private Data Members
  private openSubscriptions: Subscription[] = [];
  //#endregion private Data Members

  //#region Framwork Hooks
  constructor(
    private formBuilder: FormBuilder,
    private changePasswordBloc: ChangePasswordBloc,
    private router: Router,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Account management | Setting page');
    this.getBlocState();
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.unsubscribeOpenSubscriptions();
  }
  //#endregion Framework Hooks

  //#region Public Methods
  public get createPasswordFormControls(): {
    [key: string]: AbstractControl;
  } {
    return this.createPasswordForm?.controls;
  }

  //build form
  public buildForm(): void {
    this.getUserSubmissionStatus();
    this.createPasswordForm = this.formBuilder.group({
      oldPassword: [null, [Validators.required]],
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
    //Update validators on confirm password when password changes
    this.createPasswordFormControls['newPassword']?.valueChanges.subscribe(
      () => {
        this.createPasswordFormControls[
          'confirmPassword'
        ]?.updateValueAndValidity();
      }
    );
  }

  //toggle icon to show pass
  //#region hide and show password methods
  public onShowOldPassword(): void {
    this.showOldPassword = !this.showOldPassword;
  }

  public onShowNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  public onShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  //#endregion hide and show password methods

  //submit new password
  public createPasswordSubmit(form: FormGroup): void {
    let payload = {
      password: form?.get('oldPassword')?.value,
      newPassword: form?.get('newPassword')?.value,
    };
    this.changePasswordBloc.events.next(new ChangePasswordEvent(payload));
  }

  //at cancel
  public cancel(): void {
    this.createPasswordForm?.reset();
    this.router.navigateByUrl('/setting');
  }
  //#endregion Public Methods

  //#region Private Methods
  private unsubscribeOpenSubscriptions(): void {
    if (this.openSubscriptions.length) {
      this.openSubscriptions.forEach((sub) => sub.unsubscribe());
    }
  }
  //#endregion Private Methods

  //#region Private Service Methods
  private getUserSubmissionStatus(): void {
    const isSubmitting = this.changePasswordBloc.is_submitting$.subscribe(
      (res) => {
        this.is_submitting = res;
      }
    );
    this.openSubscriptions.push(isSubmitting);
  }
  //#endregion Private Service Methods

  //#region Private Bloc Methods
  private getBlocState(): void {
    const blocStateSubscription = this.changePasswordBloc.states$.subscribe(
      (data) => {
        this.viewState = data;
      }
    );
    this.openSubscriptions.push(blocStateSubscription);
  }
  //#endregion Private Bloc Methods
}
