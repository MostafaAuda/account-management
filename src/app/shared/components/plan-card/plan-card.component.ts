import { ServiceType } from './../../../core/models/service.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-plan-card',
  templateUrl: './plan-card.component.html',
  styleUrls: ['./plan-card.component.scss'],
})
export class PlanCardComponent {
  //#region Public Data Members
  @Input() public serviceType?: string;
  @Input() public planName?: string;
  @Input() public planDescription?: string;
  @Input() public borderColor?: string;
  @Input() public linearGradientTop?: string;
  @Input() public linearGradientBottom?: string;
  @Input() public planPrice?: string;
  @Input() public startDate?: string;
  @Input() public endDate?: string;
  @Input() public isSubscribed?: boolean;

  @Output() public onSubscribe = new EventEmitter();
  @Output() public onUnsubscribe = new EventEmitter();

  public ServiceTypeName = ServiceType;
  //#endregion Public Data Members

  //#region Public Methods
  public onUserSubscribe(): void {
    this.onSubscribe.emit();
  }

  public onUserUnsubscribe(): void {
    this.onUnsubscribe.emit();
  }
  //#endregion Public Methods
}
