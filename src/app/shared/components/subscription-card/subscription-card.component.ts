import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-subscription-card',
  templateUrl: './subscription-card.component.html',
  styleUrls: ['./subscription-card.component.scss'],
})
export class SubscriptionCardComponent {
  //#region Public Data Members
  @Input() public subscriptionID?: string;
  @Input() public serviceType?: string;
  @Input() public planTypeID?: string;
  @Input() public bundleID?: string;
  @Input() public bundle?: string;
  @Input() public price?: string;
  @Input() public billingDate?: string;

  @Output() public viewPlanDetails = new EventEmitter<any>();
  @Output() public cancelSubscription = new EventEmitter<any>();
  //#endregion Public Data Members

  //#region Public Methods
  public onViewPlanDetails(): void {
    this.viewPlanDetails.emit();
  }

  public onCancelSubscription(): void {
    this.cancelSubscription.emit();
  }
  //#endregion Public Methods
}
