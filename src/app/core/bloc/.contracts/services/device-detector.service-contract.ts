export enum DeviceOS {
  iOS = 'iOS',
  Android = 'Android',
  Huawei = 'Huawei',
}

export interface DeviceData {
  DeviceOS: string;
  isMobileOrTablet: boolean;
  isDesktop: boolean;
}

export abstract class DeviceDetectorServiceContract {
  abstract getDeviceDetails(): DeviceData;
}
