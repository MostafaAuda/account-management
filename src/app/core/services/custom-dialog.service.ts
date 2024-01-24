import {
  customDialog,
  CustomDialogServiceContract,
} from './../bloc/.contracts/services/custom-dialog.service-contract';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root',
})
export class CustomDialogService implements CustomDialogServiceContract {
  //#region Framework Hooks
  constructor(private dialog: MatDialog) {}
  //#endregion Framework Hooks

  //#region Public Methods
  public showCustomDialog(customDialog: customDialog, dialogData?: any): void {
    let objData: any = {};

    if (dialogData) {
      /**
       * Documentation on object.entries
       * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
       */
      for (const [key, value] of Object.entries(dialogData)) {
        objData[`${key}`] = `${value}`;
      }
    }

    this.dialog.open(customDialog.customComponent, {
      panelClass: customDialog.customClass,
      data: objData,
    });
  }
  //#endregion Public Methods
}
