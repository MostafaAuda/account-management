import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ServiceType } from 'src/app/core/models/service.model';
@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss'],
})
export class ServiceCardComponent {
  //#region Public Data Members
  serviceTypeName = ServiceType;
  @Input() public serviceID?: string;
  @Input() public serviceType?: string;
  @Input() public totalPlans?: number;
  @Input() public serviceDescription?: string;

  @Output() public discoverPlans = new EventEmitter<any>();
  //#endregion Public Data Members

  //#region Public Methods
  public onDiscoverPlansClick(): void {
    this.discoverPlans.emit();
  }
  //#endregion Public Methods
}
