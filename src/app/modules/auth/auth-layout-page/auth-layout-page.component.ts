import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-auth-layout-page',
  templateUrl: './auth-layout-page.component.html',
  styleUrls: ['./auth-layout-page.component.scss'],
})
export class AuthLayoutPageComponent {
  //#region Public data members
  @ViewChild('layout_container') layout_container!: ElementRef;
  @ViewChild('header') header!: ElementRef;
  //#endregion Public data members

  //#region Public Methods
  public continue(): void {
    this.layout_container.nativeElement.classList.add('activate-mobile-view');
    this.header.nativeElement.classList.add('form-logo-mobile');
  }
  //#endregion Public Methods
}
