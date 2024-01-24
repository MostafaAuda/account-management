import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationServiceContract } from 'src/app/core/bloc/.contracts/services/auth.service-contract';

@Injectable({
  providedIn: 'root',
})
export class AuthInnerPageGuard implements CanActivate {
  //#region Framwork hooks
  constructor(
    private _authService: AuthenticationServiceContract,
    private router: Router
  ) {}
  //#endregion Framwork hooks

  //#region Public Methods
  public canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this._authService.authEntryDataSnapshot.entryID == '') {
      this.router.navigateByUrl('auth');
      return false;
    } else {
      return true;
    }
  }
  //#endregion Public Methods
}
