import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { customDialog } from 'src/app/core/bloc/.contracts/services/custom-dialog.service-contract';
@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss'],
})
export class InfoDialogComponent {
  public termsConditions: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  public static termsConditionsDialog(): customDialog {
    return new customDialog(InfoDialogComponent, 'info-dialog');
  }
  public static privacyPolicyDialog(): customDialog {
    return new customDialog(InfoDialogComponent, 'info-dialog');
  }
}
