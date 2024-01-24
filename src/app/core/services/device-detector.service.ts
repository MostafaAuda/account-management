import { Injectable } from '@angular/core';
import {
  DeviceDetectorServiceContract,
  DeviceData,
} from 'src/app/core/bloc/.contracts/services/device-detector.service-contract';
import { DeviceDetectorService as _DeviceDetectorService } from 'ngx-device-detector';
@Injectable({
  providedIn: 'root',
})
export class DeviceDetectorService implements DeviceDetectorServiceContract {
  //#region Framework Hooks
  constructor(private _DeviceDetectorService: _DeviceDetectorService) {}
  //#endregion Framework Hooks

  //#region Public Methods
  public getDeviceDetails(): DeviceData {
    let DeviceData = {
      DeviceOS: this._DeviceDetectorService.getDeviceInfo().os,
      isMobileOrTablet:
        this._DeviceDetectorService.isMobile() ||
        this._DeviceDetectorService.isTablet(),
      isDesktop: this._DeviceDetectorService.isDesktop(),
    };
    return DeviceData;
  }
  //#endregion Public Methods
}
