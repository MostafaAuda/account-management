export enum snackbarType {
  Success,
  Error,
  Info,
}
export abstract class SnackbarServiceContract {
  /**
  *IMPORTANT: Use this sample to fire the snackbar
  openSnackbar() {
    this.snackbarService.show(
      'Your request of removing Credit Card ending with XXX-765 is done successfully',
      snackbarType.Success
    );
  */
  abstract show(message: string, type: snackbarType): void;
}
