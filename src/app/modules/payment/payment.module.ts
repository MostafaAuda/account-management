import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment-page/payment.component';
import { ManagePaymentComponent } from './manage-payment/manage-payment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentRoutingModule } from './payment-routing.module';

@NgModule({
  declarations: [PaymentComponent, ManagePaymentComponent],
  imports: [CommonModule, PaymentRoutingModule, SharedModule],
})
export class PaymentModule {}
