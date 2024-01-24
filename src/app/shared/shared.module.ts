import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsPipe } from './pipes/as.pipe';
import { EmptyDataComponent } from './global-components/empty-data/empty-data.component';
import { TryAgainComponent } from './global-components/try-again/try-again.component';
import { LoadingSpinnerComponent } from './global-components/loading-spinner/loading-spinner.component';
import { SkeletonLoaderComponent } from './global-components/skeleton-loader/skeleton-loader.component';
import { NotFoundComponent } from './global-components/not-found/not-found.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgOtpInputModule } from 'ng-otp-input';
import { SwiperModule } from 'swiper/angular';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { PlanCardComponent } from './components/plan-card/plan-card.component';
import { PromotionalCardComponent } from './components/promotional-card/promotional-card.component';
import { ServiceCardComponent } from './components/service-card/service-card.component';
import { SubscriptionCardComponent } from './components/subscription-card/subscription-card.component';
import { PaymentCardMethodsComponent } from './components/payment-card-methods/payment-card-methods.component';
import { PaymentHistoryCardComponent } from './components/payment-history-card/payment-history-card.component';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from './global-components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/shared/global-components/snackbar/snackbar.component';
import { NoConnectionComponent } from './global-components/no-connection/no-connection.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
@NgModule({
  providers: [ConfirmationDialogService, DatePipe],
  declarations: [
    //Directives

    //Pipes
    AsPipe,

    //Global components
    EmptyDataComponent,
    TryAgainComponent,
    LoadingSpinnerComponent,
    SkeletonLoaderComponent,
    NotFoundComponent,
    PageTitleComponent,
    PromotionalCardComponent,
    NoConnectionComponent,
    ConfirmationDialogComponent,
    SnackbarComponent,

    //Modals

    //Components
    ProductCardComponent,
    PlanCardComponent,
    ServiceCardComponent,
    SubscriptionCardComponent,
    PaymentCardMethodsComponent,
    PaymentHistoryCardComponent,
  ],
  imports: [
    MatSidenavModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,

    //Global modules
    CommonModule,
    RouterModule,
    NgOtpInputModule,
    SwiperModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    NgxSkeletonLoaderModule,
    NgxSpinnerModule,
  ],
  exports: [
    //Directives

    //Pipes
    AsPipe,

    //Global components
    EmptyDataComponent,
    TryAgainComponent,
    LoadingSpinnerComponent,
    SkeletonLoaderComponent,
    NotFoundComponent,
    PageTitleComponent,
    PromotionalCardComponent,
    NoConnectionComponent,
    ConfirmationDialogComponent,
    SnackbarComponent,

    //Components
    ProductCardComponent,
    PlanCardComponent,
    ServiceCardComponent,
    SubscriptionCardComponent,
    PaymentCardMethodsComponent,
    PaymentHistoryCardComponent,

    //Material modules
    MatSidenavModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,

    //Global modules
    NgOtpInputModule,
    SwiperModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    NgxSkeletonLoaderModule,
    NgxSpinnerModule,
  ],
})
export class SharedModule {}
