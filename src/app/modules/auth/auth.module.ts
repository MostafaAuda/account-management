import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginSignupRoutingModule } from './auth-routing.module';
import { AuthLayoutPageComponent } from './auth-layout-page/auth-layout-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import '@lottiefiles/lottie-player';
import { AuthLoginVerificationPageComponent } from './auth-login-verification-page/auth-login-verification-page.component';
import { AuthSigninPageComponent } from './auth-signin-page/auth-signin-page.component';
import { AuthForgotPasswordPageComponent } from './auth-forgot-password-page/auth-forgot-password-page.component';
import { AuthSignupPageComponent } from './auth-signup-page/auth-signup-page.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AuthLayoutPageComponent,
    AuthLoginVerificationPageComponent,
    AuthSigninPageComponent,
    AuthForgotPasswordPageComponent,
    AuthSignupPageComponent,
  ],
  imports: [CommonModule, LoginSignupRoutingModule, SharedModule, RouterModule],
})
export class LoginSignupModule {}
