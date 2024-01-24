import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  //#region Framework Hooks
  constructor() {}
  //#endregion Framework Hooks

  //#region Setters
  public saveUserLang(lang: string): void {
    localStorage.setItem('lang', JSON.stringify(lang));
  }

  public saveUserToken(userToken: string): void {
    localStorage.setItem('userToken', JSON.stringify(userToken));
  }

  public saveUserLoginType(userLoginType: string): void {
    localStorage.setItem('userLoginType', JSON.stringify(userLoginType));
  }

  public saveIsUserFirstTimeLogin(isUserFirstTimeLogin: boolean): void {
    localStorage.setItem(
      'isUserFirstTimeLogin',
      JSON.stringify(isUserFirstTimeLogin)
    );
  }

  public saveAuthenticationID(userAuthenticationID: string | number): void {
    localStorage.setItem(
      'userAuthenticationID',
      JSON.stringify(userAuthenticationID)
    );
  }
  //#endregion Setters

  //#region Getter
  public getUserLang(): string {
    return JSON.parse(localStorage.getItem('lang') || 'en');
  }

  public getUserToken(): string {
    return JSON.parse(localStorage.getItem('userToken') || '');
  }

  public getUserLoginType(): string {
    return JSON.parse(localStorage.getItem('userLoginType') || '');
  }

  public getIsUserFirstTimeLogin(): boolean {
    return JSON.parse(localStorage.getItem('isUserFirstTimeLogin') || '');
  }

  public getUserAuthenticationID(): string {
    return JSON.parse(localStorage.getItem('userAuthenticationID') || '');
  }
  //#endregion Getter

  //#region Removes
  public removeUserLang(): void {
    localStorage.removeItem('lang');
  }

  public removeUserToken(): void {
    localStorage.removeItem('userToken');
  }

  public removeUserLoginType(): void {
    localStorage.removeItem('userLoginType');
  }

  public removeIsUserFirstTimeLogin(): void {
    localStorage.removeItem('isUserFirstTimeLogin');
  }

  public removeUserAuthenticationID(): void {
    localStorage.removeItem('userAuthenticationID');
  }
  //#endregion Removes
}
