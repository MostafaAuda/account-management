import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-data',
  templateUrl: './empty-data.component.html',
  styleUrls: ['./empty-data.component.scss'],
})
export class EmptyDataComponent {
  //#region Public data members
  @Input() public Title: any;
  @Input() public Description: any;
  //#endregion Public data members
}
