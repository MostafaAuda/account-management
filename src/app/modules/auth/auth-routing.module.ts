import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthInnerPageGuard } from 'src/app/shared/guards/auth-inner-page.guard';
import { AuthForgotPasswordPageComponent } from './auth-forgot-password-page/auth-forgot-password-page.component';
import { AuthLayoutPageComponent } from './auth-layout-page/auth-layout-page.component';
import { AuthLoginVerificationPageComponent } from './auth-login-verification-page/auth-login-verification-page.component';
import { AuthSigninPageComponent } from './auth-signin-page/auth-signin-page.component';
import { AuthSignupPageComponent } from './auth-signup-page/auth-signup-page.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutPageComponent,
    children: [
      {
        path: '',
        component: AuthLoginVerificationPageComponent,
      },
      {
        path: 'signin',
        component: AuthSigninPageComponent,
        canActivate: [AuthInnerPageGuard],
      },
      {
        path: 'signup',
        component: AuthSignupPageComponent,
        canActivate: [AuthInnerPageGuard],
      },
      {
        path: 'forgot-password',
        component: AuthForgotPasswordPageComponent,
        canActivate: [AuthInnerPageGuard],
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginSignupRoutingModule {}
