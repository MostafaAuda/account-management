import {
  SnackbarServiceContract,
  snackbarType,
} from '../bloc/.contracts/services/snackbar.service-contract';
import { Injectable } from '@angular/core';
import { SnackbarComponent } from 'src/app/shared/global-components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class SnackbarService implements SnackbarServiceContract {
  //#region Framework Hooks
  constructor(private snackBar: MatSnackBar) {}
  //#endregion Framework Hooks

  //#region Public Methods
  public show(message: string, type: snackbarType): void {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 3000,
      horizontalPosition: 'start',
      panelClass: 'twist-snackbar',
      data: {
        message: message,
        type: type,
      },
    });
  }

  //#endregion Public Methods
}
