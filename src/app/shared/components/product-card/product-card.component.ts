import { CustomDialogServiceContract } from 'src/app/core/bloc/.contracts/services/custom-dialog.service-contract';
import { ProductsDTOModel } from './../../../core/models/product.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { productSwiperConfigurations } from '../../configs/swiper-configs';
import SwiperCore, { SwiperOptions, Navigation } from 'swiper';
import {
  BarcodeModalComponent,
  platformType,
} from 'src/app/modules/home/barcode-modal/barcode-modal.component';
import {
  DeviceDetectorServiceContract,
  DeviceData,
  DeviceOS,
} from 'src/app/core/bloc/.contracts/services/device-detector.service-contract';
import { ServiceType } from 'src/app/core/models/service.model';

SwiperCore.use([Navigation]);
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  //#region Public Data Members
  public productSwiperConfig: SwiperOptions = productSwiperConfigurations;

  //Device Service Handling Parameters
  public platformType = platformType;
  public downloadAppData: downloadAppData = {
    url: '',
    deviceOS: '',
    icon: '',
  };
  public DeviceData: DeviceData;
  public serviceTypeName = ServiceType;

  @Input() public productID?: string;
  @Input() public productName?: string;
  @Input() public serviceType?: string;
  @Input() public productDescription?: string;
  @Input() public productLogo?: string;
  @Input() public websiteUrl?: string;
  @Input() public appStoreUrl?: string;
  @Input() public playStoreUrl?: string;
  @Input() public huaweiStoreUrl?: string;
  @Input() public appStoreBarcode?: string;
  @Input() public playStoreBarcode?: string;
  @Input() public huaweiStoreBarcode?: string;

  @Input() public subscriptionsCount?: number;
  @Input() public productsDTO?: ProductsDTOModel[];

  @Output() public goToApp = new EventEmitter();
  @Output() public goToDiscoverPlans = new EventEmitter();
  //#endregion Public Data Members

  //#region Framework Hooks
  constructor(
    private deviceService: DeviceDetectorServiceContract,
    private customDialog: CustomDialogServiceContract
  ) {
    this.DeviceData = this.deviceService.getDeviceDetails();
  }

  public ngOnInit(): void {
    this.handleDownloadAppOS();
  }
  //#endregion Framework Hooks

  //#region Public Methods
  public onDownLoadAppOrRouteToAppClick(): void {
    this.goToApp.emit();
  }

  public goToPlans(): void {
    this.goToDiscoverPlans.emit();
  }

  public openBarcodeDialog(platformType: platformType, barcode?: string): void {
    this.customDialog.showCustomDialog(BarcodeModalComponent.barcodeDialog(), {
      barcode: barcode,
      platformType: platformType,
    });
  }
  //#endregion Public Methods

  //#region Private Methods
  private handleDownloadAppOS(): void {
    switch (this.DeviceData.DeviceOS) {
      case DeviceOS.iOS:
        this.downloadAppData = {
          url: this.appStoreUrl,
          deviceOS: DeviceOS.iOS,
          icon: 'assets/imgs/icn_app_store_home.svg',
        };
        break;

      case DeviceOS.Android:
        this.downloadAppData = {
          url: this.playStoreUrl,
          deviceOS: DeviceOS.Android,
          icon: 'assets/imgs/icn_google_play_home.svg',
        };
        break;

      case DeviceOS.Huawei:
        this.downloadAppData = {
          url: this.huaweiStoreUrl,
          deviceOS: DeviceOS.Huawei,
          icon: 'assets/imgs/icn_app_store_home.svg',
        };
        break;

      default:
        break;
    }
  }
  //#endregion Private Methods
}

export interface downloadAppData {
  url?: string | undefined;
  deviceOS?: string;
  icon?: string;
}
