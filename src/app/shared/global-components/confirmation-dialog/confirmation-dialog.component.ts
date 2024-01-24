import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IconTypes } from 'src/app/core/bloc/.contracts/services/confirm-dialog.service-contract';
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  //#region Declarations
  public IconTypes = IconTypes;
  //#endregion

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
