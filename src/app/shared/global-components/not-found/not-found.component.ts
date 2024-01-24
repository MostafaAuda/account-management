import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  constructor(private location: Location) {}

  //#region Private methods
  public onGoBack() {
    this.location.back();
  }
  //#endregion Private methods
}
