import { DatePipe } from '@angular/common';
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
import { UpdateUserInfoBloc } from 'src/app/core/bloc/setting/update-user-Info/update-user-Info.bloc';
import {
  SaveUpdateInfoEvent,
  UpdateInfoStates,
  UpdateUserInfoReadyState,
  UpdateInfoStatesName,
  HydrateEvent,
} from 'src/app/core/bloc/setting/update-user-Info/update-user-Info.bloc-model';
import { UserInfo } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-update-user-info',
  templateUrl: './update-user-info.component.html',
  styleUrls: ['./update-user-info.component.scss'],
  providers: [UpdateUserInfoBloc],
})
export class UpdateUserInfoComponent {
  //#region Public Data Members
  public personalInformationForm!: FormGroup;
  public builderForm!: FormBuilder;
  public is_submitting: boolean = false;
  public viewState!: UpdateInfoStates;
  public updateInfoStatesName = UpdateInfoStatesName;
  public UpdateUserInfoReadyState = UpdateUserInfoReadyState;
  public dateToday!: any;
  //#endregion Public Data Members

  //#region Private  Data Members
  private openSubscriptions: Subscription[] = [];
  //#endregion private  Data Members

  //#region Framework Hooks
  constructor(
    private updateUserInfoBloc: UpdateUserInfoBloc,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private title: Title,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Account management | Setting page');
    this.getBlocState();
    this.registerBlocEvent();
  }

  ngOnDestroy(): void {
    this.unsubscribeOpenSubscriptions();
  }
  //#endregion Framework Hooks

  //#region Private Methods
  //build the form
  private buildForm(personalInformation: UserInfo): void {
    this.getUserSubmissionStatus();

    //Fill input date with current date
    this.dateToday = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.personalInformationForm = this.formBuilder.group({
      username: [
        personalInformation?.username,
        [Validators.minLength(3), Validators.maxLength(40)],
      ],
      email: [personalInformation?.email, [Validators.email]],
      phone: [
        personalInformation?.phone,
        [
          Validators.maxLength(11),
          Validators.minLength(11),
          Validators.pattern('01[0,1,2,5]{1}[0-9]{8}'),
        ],
      ],
      birthDate: [
        this.datePipe.transform(personalInformation?.birthDate, 'yyyy-MM-dd'),
        ,
      ],
    });
  }

  private unsubscribeOpenSubscriptions(): void {
    if (this.openSubscriptions.length) {
      this.openSubscriptions.forEach((sub) => sub.unsubscribe());
    }
  }
  //#endregion Private Methods

  //#region Private Service Methods
  private getUserSubmissionStatus(): void {
    const isSubmitting = this.updateUserInfoBloc.is_submitting$.subscribe(
      (res: boolean) => {
        this.is_submitting = res;
      }
    );
    this.openSubscriptions.push(isSubmitting);
  }
  //#endregion Private Service Methods

  //#region Private Bloc Methods
  private getBlocState(): void {
    const blocStateSubscription = this.updateUserInfoBloc.states$.subscribe(
      (data) => {
        this.viewState = data;
        this.buildForm((this.viewState as UpdateUserInfoReadyState).recentInfo);
      }
    );
    this.openSubscriptions.push(blocStateSubscription);
  }

  private registerBlocEvent(): void {
    this.updateUserInfoBloc.events.next(new HydrateEvent());
  }
  //#endregion Private Bloc Methods

  //#region Public Methods
  public get PersonalInfoFormControls(): {
    [key: string]: AbstractControl;
  } {
    return this.personalInformationForm?.controls;
  }

  //save the updated info
  public updateUserInfo(form: FormGroup): void {
    let payload = form.value;
    this.updateUserInfoBloc.events.next(new SaveUpdateInfoEvent(payload));
  }

  //cancel link
  public cancel(): void {
    this.personalInformationForm?.reset();
    this.router.navigateByUrl('/setting');
  }
  //#endregion Public Methods
}
