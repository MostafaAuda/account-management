import { DeviceDetectorService } from './core/services/device-detector.service';
import { DeviceDetectorServiceContract } from 'src/app/core/bloc/.contracts/services/device-detector.service-contract';
import { CustomDialogService } from './core/services/custom-dialog.service';
import { CustomDialogServiceContract } from 'src/app/core/bloc/.contracts/services/custom-dialog.service-contract';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConnectivityServiceContract } from './core/bloc/.contracts/services/connectivity.service-contract';
import { ConnectivityService } from './core/services/connectivity.service';
import { ProductApiContract, ProductRepo } from './core/data/repo/product.repo';
import { ProductApi } from './core/data/api/product.api';
import { ProductRepoContract } from './core/bloc/.contracts/repos/product.repo-contract';
import { PaymentApiContract, PaymentRepo } from './core/data/repo/payment.repo';
import { PaymentRepoContract } from './core/bloc/.contracts/repos/payment.repo-contract';
import { PaymentApi } from './core/data/api/payment.api';
import { UserRepoContract } from './core/bloc/.contracts/repos/user.repo-contract';
import { UserApiContract, UserRepo } from './core/data/repo/user.repo';
import { UpdateInfoApi } from './core/data/api/user.api';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog.service';
import { ConfirmationDialogServiceContract } from 'src/app/core/bloc/.contracts/services/confirm-dialog.service-contract';
import { SnackbarServiceContract } from './core/bloc/.contracts/services/snackbar.service-contract';
import { SnackbarService } from './core/services/snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LocalizationServiceContract } from './core/bloc/.contracts/services/localization.service-contract';
import { LocalizationService } from './core/services/localization.service';
import { AuthenticationServiceContract } from './core/bloc/.contracts/services/auth.service-contract';
import { AuthenticationService } from './core/services/auth.service';
import { ServicesRepoContract } from './core/bloc/.contracts/repos/services.repo-contract';
import { UserSubscriptionsRepoContract } from './core/bloc/.contracts/repos/user-subscriptions.repo-contract';
import { UserSubscriptionsApi } from './core/data/api/user-subscriptions.api';
import {
  UserSubscriptionsApiContract,
  UserSubscriptionsRepo,
} from './core/data/repo/user-subscriptions.repo';
import { PlansApi } from './core/data/api/services.api';
import {
  ServicesApiContract,
  ServicesRepo,
} from './core/data/repo/services.repo';
import { LoadingSpinnerService } from './core/services/loading-spinner.service';
import { LoadingSpinnerServiceContract } from './core/bloc/.contracts/services/loading-spinner.service-contract';
import { AuthApiContract, AuthRepo } from './core/data/repo/auth.repo';
import { AuthApi } from './core/data/api/auth.api';
import { AuthRepoContract } from './core/bloc/.contracts/repos/auth.repo-contract';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    MatSnackBarModule,
    MatDialogModule,
  ],
  providers: [
    //API provisioning
    { provide: ProductApiContract, useClass: ProductApi },
    { provide: UserApiContract, useClass: UpdateInfoApi },
    { provide: PaymentApiContract, useClass: PaymentApi },
    { provide: UserApiContract, useClass: UpdateInfoApi },
    { provide: ServicesApiContract, useClass: PlansApi },
    { provide: UserSubscriptionsApiContract, useClass: UserSubscriptionsApi },
    { provide: AuthApiContract, useClass: AuthApi },

    //Repo provisioning
    { provide: ProductRepoContract, useClass: ProductRepo },
    { provide: UserRepoContract, useClass: UserRepo },
    { provide: PaymentRepoContract, useClass: PaymentRepo },
    { provide: UserRepoContract, useClass: UserRepo },
    { provide: ServicesRepoContract, useClass: ServicesRepo },
    { provide: UserSubscriptionsRepoContract, useClass: UserSubscriptionsRepo },
    { provide: AuthRepoContract, useClass: AuthRepo },

    //Service provisioning
    { provide: AuthenticationServiceContract, useClass: AuthenticationService },
    { provide: ConnectivityServiceContract, useClass: ConnectivityService },
    {
      provide: ConfirmationDialogServiceContract,
      useClass: ConfirmationDialogService,
    },
    { provide: SnackbarServiceContract, useClass: SnackbarService },
    { provide: LocalizationServiceContract, useClass: LocalizationService },
    { provide: AuthenticationServiceContract, useClass: AuthenticationService },
    {
      provide: CustomDialogServiceContract,
      useClass: CustomDialogService,
    },
    {
      provide: DeviceDetectorServiceContract,
      useClass: DeviceDetectorService,
    },
    {
      provide: LoadingSpinnerServiceContract,
      useClass: LoadingSpinnerService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
