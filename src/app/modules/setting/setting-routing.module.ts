import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { SettingPageComponent } from './setting-page/setting-page.component';
import { UpdateUserInfoComponent } from './update-user-Info/update-user-info.component';

const routes: Routes = [
  {
    path: '',
    component: SettingPageComponent,
  },
  {
    path: 'updateUserInfo',
    component: UpdateUserInfoComponent,
  },
  {
    path: 'changePassword',
    component: ChangePassComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule {}
