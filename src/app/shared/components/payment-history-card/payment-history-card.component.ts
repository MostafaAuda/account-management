import { Component, Input } from '@angular/core';
import { PaymentMethodType } from 'src/app/core/models/payment.model';
import { ServiceType } from 'src/app/core/models/service.model';

@Component({
  selector: 'app-payment-history-card',
  templateUrl: './payment-history-card.component.html',
  styleUrls: ['./payment-history-card.component.scss'],
})
export class PaymentHistoryCardComponent {
  //#region Public declarations
  public paymentMethods = PaymentMethodType;
  public serviceTypeName = ServiceType;
  //#endregion Public declarations

  //#region Inputs declarations
  @Input() paymentType?: PaymentMethodType;
  @Input() cardCategory?: ServiceType;
  @Input() phoneOrCardNumber?: string;
  @Input() subscribed?: string;
  @Input() creationDate?: Date;
  @Input() planPrice?: string;
  @Input() bundleName?: string;
  //#endregion Inputs declarations
}
