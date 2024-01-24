import { Component, Inject, inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { snackbarType } from 'src/app/core/bloc/.contracts/services/snackbar.service-contract';
@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent {
  //#region Declarations
  public snackbarType = snackbarType;
  public snackBarRef = inject(MatSnackBarRef);
  //#endregion
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
