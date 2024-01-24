import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentMethodType } from 'src/app/core/models/payment.model';

@Component({
  selector: 'app-payment-card-methods',
  templateUrl: './payment-card-methods.component.html',
  styleUrls: ['./payment-card-methods.component.scss'],
})
export class PaymentCardMethodsComponent {
  //#region Public declarations
  public paymentMethods = PaymentMethodType;
  //#endregion Public declarations

  //#region Inputs declarations
  @Input() public paymentType?: PaymentMethodType;
  @Input() public phoneOrCardNumber?: string;
  @Input() public expiryDate?: Date;
  @Input() public primaryMethod?: boolean = false;
  @Input() public hideManage?: boolean = false;

  //#endregion Inputs declarations

  //#region Outputs declarations
  @Output() public remove = new EventEmitter<any>();
  @Output() public removeDefault = new EventEmitter<any>();
  @Output() public setDefault = new EventEmitter<any>();

  //#endregion Outputs declarations

  //#region Public methods
  public onRemove(): void {
    this.remove.emit();
  }

  public onRemoveDefault(): void {
    this.removeDefault.emit();
  }

  public onSetDefault(): void {
    this.setDefault.emit();
  }
  //#endregion Public methods
}
