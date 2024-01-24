import { PlansSubscriptionsRoutingModule } from './plans-subscriptions-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlansSubscriptionsPageComponent } from './plans-subscriptions-page/plans-subscriptions-page.component';
import { PlansPageComponent } from './plans-page/plans-page.component';

@NgModule({
  declarations: [PlansSubscriptionsPageComponent, PlansPageComponent],
  imports: [CommonModule, PlansSubscriptionsRoutingModule, SharedModule],
})
export class PlansSubscriptionsModule {}
