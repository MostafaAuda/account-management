import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/global-components/confirmation-dialog/confirmation-dialog.component';
import {
  ConfirmationDialogServiceContract,
  IconTypes,
} from 'src/app/core/bloc/.contracts/services/confirm-dialog.service-contract';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService
  implements ConfirmationDialogServiceContract
{
  //#region Framework hooks
  constructor(private dialog: MatDialog, private translate: TranslateService) {}
  //#endregion Framework hooks

  //#region Public methods
  public showConfirmationDialog(settings: {
    title: string;
    iconType: IconTypes;
    text?: string;
    confirmFunction?: Function;
  }): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        icon: settings.iconType,
        title: this.translate.instant(settings.title),
        text: settings.text,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        settings.confirmFunction?.();
      }
    });
  }
  //#endregion Public methods
}
