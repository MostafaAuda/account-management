import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { customDialog } from 'src/app/core/bloc/.contracts/services/custom-dialog.service-contract';
@Component({
  selector: 'app-barcode-modal',
  templateUrl: './barcode-modal.component.html',
  styleUrls: ['./barcode-modal.component.scss'],
})
export class BarcodeModalComponent {
  //#region Framework Hooks
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  //#endregion Framework Hooks

  //#region Public Methods
  public static barcodeDialog(): customDialog {
    return new customDialog(BarcodeModalComponent, 'barcode-modal');
  }
  //#endregion Public Methods
}

//#region Public Enum
export enum platformType {
  iOS = 'App Store',
  Android = 'Google play',
  Huawei = 'AppGallery',
}
//#endregion Public Enum
