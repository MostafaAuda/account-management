import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-promotional-card',
  templateUrl: './promotional-card.component.html',
  styleUrls: ['./promotional-card.component.scss'],
})
export class PromotionalCardComponent {
  //#region Public Data Members
  @Input() public mobileView: boolean = false;
  //#endregion Public Data Members
}
