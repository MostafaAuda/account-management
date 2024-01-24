import { ComponentType } from '@angular/cdk/portal';
export class customDialog {
  public constructor(
    public customComponent: ComponentType<{}>,
    public customClass: string
  ) {}
}

export abstract class CustomDialogServiceContract {
  abstract showCustomDialog(
    customComponent: customDialog,
    dialogData?: any
  ): void;
}
