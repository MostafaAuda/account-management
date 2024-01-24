import { Component } from '@angular/core';
import { LocalizationServiceContract } from './core/bloc/.contracts/services/localization.service-contract';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'account-management';
  constructor(private _localization: LocalizationServiceContract) {
    this._localization.init();
  }
}
