export enum IconTypes {
  Success,
  Error,
  Info,
  Disapprove,
}

export abstract class ConfirmationDialogServiceContract {
  /**
  *IMPORTANT: Use this sample to fire the confirmation
  openDialog() {
    this.confirmDialog.showConfirmationDialog({
      title: 'Are you sure you want to cancel subscription?',
      iconType: IconTypes.Error,
      confirmFunction: this.test.bind(this),
    });
  }

  test() {
    console.log('init func');
  }
   */
  abstract showConfirmationDialog(settings: {
    title: string;
    iconType: IconTypes;
    text?: string;
    confirmFunction?: Function;
  }): void;
}
