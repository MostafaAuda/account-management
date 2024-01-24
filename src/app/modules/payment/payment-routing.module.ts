import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagePaymentComponent } from './manage-payment/manage-payment.component';
import { PaymentComponent } from './payment-page/payment.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentComponent,
  },
  {
    path: 'manage',
    component: ManagePaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
