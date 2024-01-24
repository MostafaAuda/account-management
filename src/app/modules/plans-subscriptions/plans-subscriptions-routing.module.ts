import { PlansPageComponent } from './plans-page/plans-page.component';
import { PlansSubscriptionsPageComponent } from './plans-subscriptions-page/plans-subscriptions-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PlansSubscriptionsPageComponent,
  },
  {
    path: ':serviceType',
    component: PlansPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlansSubscriptionsRoutingModule {}
