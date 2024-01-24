import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-try-again',
  templateUrl: './try-again.component.html',
  styleUrls: ['./try-again.component.scss'],
})
export class TryAgainComponent {
  //#region Declarations
  @Output() public onTryAgain: EventEmitter<any> = new EventEmitter<any>();
  //#endregion

  public tryAgain(): void {
    this.onTryAgain.emit();
  }
}
