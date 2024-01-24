import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SettingRoutingModule } from './setting-routing.module';
import { SettingPageComponent } from './setting-page/setting-page.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { UpdateUserInfoComponent } from './update-user-Info/update-user-info.component';
import { InfoDialogComponent } from './info-dialog-modal/info-dialog.component';

@NgModule({
  declarations: [
    SettingPageComponent,
    ChangePassComponent,
    UpdateUserInfoComponent,
    InfoDialogComponent,
  ],
  imports: [CommonModule, SettingRoutingModule, SharedModule],
})
export class SettingModule {}
