import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AuthenticationServiceContract,
  AuthEntryData,
  EntryType,
} from '../bloc/.contracts/services/auth.service-contract';
import { AuthResponseModel } from '../models/auth.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements AuthenticationServiceContract {
  //#region Public Data Members
  public isUserSubmittingStream: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public authEntryDataStream: BehaviorSubject<AuthEntryData> =
    new BehaviorSubject<AuthEntryData>({
      entryID: '',
      entryType: EntryType.email,
    });

  public get authEntryDataSnapshot(): AuthEntryData {
    return this.authEntryDataStream.value;
  }

  public formErrorStream: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  public otpErrorStream: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  public isUserLoggedStream: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  //#endregion Public Data Members

  //#region Framework Hooks
  constructor(
    private localStorage: LocalStorageService,
    private router: Router
  ) {}
  //#endregion Framework Hooks

  //#region Public Methods
  public get isUserSubmitting$(): Observable<boolean> {
    return this.isUserSubmittingStream.asObservable();
  }

  public get authEntryData$(): Observable<AuthEntryData> {
    return this.authEntryDataStream.asObservable();
  }

  public get formErrorData$(): Observable<string> {
    return this.formErrorStream.asObservable();
  }

  public get otpErrorData$(): Observable<string> {
    return this.otpErrorStream.asObservable();
  }

  public get isUserLogged$(): Observable<boolean> {
    return this.isUserLoggedStream.asObservable();
  }

  public resetUserEntryData(): void {
    this.authEntryDataStream.next({
      entryID: '',
      entryType: EntryType.email,
    });
  }

  public authenticateUser(data: AuthResponseModel): void {
    this.localStorage.saveUserToken(data?.data.token);
    this.isUserLoggedStream.next(true);

    this.localStorage.saveUserLoginType(data?.data.loginType);
    this.localStorage.saveIsUserFirstTimeLogin(data?.data.firstTimeLogin);
    this.localStorage.saveAuthenticationID(this.authEntryDataSnapshot.entryID);

    this.router.navigateByUrl('/');
  }

  public revokeAuthentication(): void {
    this.localStorage.removeUserToken();
    this.isUserLoggedStream.next(false);

    this.localStorage.removeUserLoginType();
    this.localStorage.removeIsUserFirstTimeLogin();
    this.localStorage.removeUserAuthenticationID();

    this.router.navigateByUrl('/auth');
  }
  //#endregion Public Methods
}
