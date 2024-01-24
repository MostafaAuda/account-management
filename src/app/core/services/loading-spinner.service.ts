import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingSpinnerServiceContract } from '../bloc/.contracts/services/loading-spinner.service-contract';

@Injectable({
  providedIn: 'root',
})
export class LoadingSpinnerService implements LoadingSpinnerServiceContract {
  //#region Framwork hooks
  constructor(private loadingSpinner: NgxSpinnerService) {}
  //#endregion Framwork hooks

  //#region Public Methods
  public showLoader(): void {
    this.loadingSpinner.show();
  }

  public hideLoader(): void {
    this.loadingSpinner.hide();
  }
  //#endregion Public Methods
}
