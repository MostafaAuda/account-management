import { Observable } from 'rxjs';

export enum AppLang {
  en = 'en',
  ar = 'ar',
}

export abstract class LocalizationServiceContract {
  abstract setLangEn(): void;
  abstract setLangAr(): void;
  abstract init(): void;
  abstract currentLang$: Observable<AppLang>;
}
