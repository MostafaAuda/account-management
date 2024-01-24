import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import {
  AppLang,
  LocalizationServiceContract,
} from '../bloc/.contracts/services/localization.service-contract';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
@Injectable({
  providedIn: 'root',
})
export class LocalizationService implements LocalizationServiceContract {
  //#region Private Data Members
  private userLang: string = 'en';
  private acceptedLangs = ['ar', 'en'];

  private currentLangStream: BehaviorSubject<AppLang> =
    new BehaviorSubject<AppLang>(AppLang.en);
  //#endregion Private Data Members

  //#region  Public Data Members
  public get currentLang$(): Observable<AppLang> {
    return this.currentLangStream.asObservable();
  }
  //#endregion Public Data Members

  //#region Framework Hooks
  constructor(
    private translate: TranslateService,
    @Inject(DOCUMENT)
    private document: Document,
    private _localStorageService: LocalStorageService
  ) {}
  // #endregion Framework Hooks

  //#region Public Methods
  public init(): void {
    this.userLang = this._localStorageService.getUserLang();
    this.setUserLang(this.userLang);
  }

  public setLangAr(): void {
    this.setUserLang('ar');
  }

  public setLangEn(): void {
    this.setUserLang('en');
  }
  //#endregion Private Methods

  //#region Private Methods
  private setUserLang(lang: string): void {
    if (!this.acceptedLangs.includes(lang)) {
      console.warn(`user language automatically set to ${this.userLang}`);
      lang = 'en';
    }

    this.translate.use(lang);

    this.userLang = lang;
    this.document.documentElement.lang = lang;

    if (lang == 'ar') {
      this.document.documentElement.dir = 'rtl';
      this.currentLangStream.next(AppLang.ar);
    } else {
      this.document.documentElement.dir = 'ltr';
      this.currentLangStream.next(AppLang.en);
    }

    this._localStorageService.saveUserLang(lang);
  }
  //#endregion Private Methods
}
