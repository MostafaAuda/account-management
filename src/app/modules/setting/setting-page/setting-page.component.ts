import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { CustomDialogServiceContract } from 'src/app/core/bloc/.contracts/services/custom-dialog.service-contract';
import { AppLang } from 'src/app/core/bloc/.contracts/services/localization.service-contract';
import { SettingPageBloc } from 'src/app/core/bloc/setting/setting-page/setting-page.bloc';
import {
  GoToChangePasswordEvent,
  GoToUpdateInfoEvent,
  SettingStates,
  SettingStatesName,
  SignoutEvent,
  SwitchLangEvent,
} from 'src/app/core/bloc/setting/setting-page/setting-page.bloc-model';
import { InfoDialogComponent } from '../info-dialog-modal/info-dialog.component';

@Component({
  selector: 'app-setting-page',
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.scss'],
  providers: [SettingPageBloc],
})
export class SettingPageComponent {
  //#region Public Data Members
  public accountsToggle: boolean = false;
  public viewState!: SettingStates;
  public settingStatesName = SettingStatesName;
  public appLang = AppLang;
  //#endregion Public Data Members

  //#region Private Data Members
  private openSubscriptions: Subscription[] = [];
  //#endregion Private Data Members

  //#region Framwork Hooks
  constructor(
    public settingBloc: SettingPageBloc,
    private title: Title,
    private customDialog: CustomDialogServiceContract
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Account management | Setting page');
    this.getBlocState();
  }

  ngOnDestroy(): void {
    this.unsubscribeOpenSubscriptions();
  }
  //#endregion Framwork Hooks

  //#region Public Events Methods
  //Change Language settings Methods
  public changeLang(selectedLang: string): void {
    this.settingBloc.events.next(new SwitchLangEvent(selectedLang));
  }

  public changePassword(): void {
    this.settingBloc.events.next(new GoToChangePasswordEvent());
  }

  public updateInfo(): void {
    this.settingBloc.events.next(new GoToUpdateInfoEvent());
  }

  public fbConnect(): void {}
  public googleConnect(): void {}
  public appleConnect(): void {}
  public signOut(): void {
    this.settingBloc.events.next(new SignoutEvent());
  }
  //#endregion Public Events Methods

  //#region Public Methods
  public openTermsDialog(): void {
    this.customDialog.showCustomDialog(
      InfoDialogComponent.termsConditionsDialog(),
      {
        dialogType: 'terms',
      }
    );
  }

  public openPrivacyDialog(): void {
    this.customDialog.showCustomDialog(
      InfoDialogComponent.privacyPolicyDialog(),
      {
        dialogType: 'privacy',
      }
    );
  }
  //#endregion Public Methods

  //#region Private Methods
  private unsubscribeOpenSubscriptions(): void {
    if (this.openSubscriptions.length) {
      this.openSubscriptions.forEach((sub) => sub.unsubscribe());
    }
  }
  //#endregion Private Methods

  //#region Private Bloc Methods
  private getBlocState(): void {
    const isSubmitting = this.settingBloc.states$.subscribe((data) => {
      this.viewState = data;
    });
    this.openSubscriptions.push(isSubmitting);
  }
  //#endregion Private Bloc Methods
}
