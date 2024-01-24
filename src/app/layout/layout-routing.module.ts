import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './layout-page/layout-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {
        path: '',
        data: {
          title: 'Home',
        },
        loadChildren: () =>
          import('../modules/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'plans',
        data: {
          title: 'Plans',
        },
        loadChildren: () =>
          import(
            '../modules/plans-subscriptions/plans-subscriptions.module'
          ).then((m) => m.PlansSubscriptionsModule),
      },
      {
        path: 'payment',
        data: {
          title: 'Payment',
        },
        loadChildren: () =>
          import('../modules/payment/payment.module').then(
            (m) => m.PaymentModule
          ),
      },
      {
        path: 'setting',
        data: {
          title: 'setting',
        },
        loadChildren: () =>
          import('../modules/setting/setting.module').then(
            (m) => m.SettingModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
