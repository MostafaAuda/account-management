import { AbstractControl, ValidationErrors } from '@angular/forms';

export class PassswordsValidators {
  public static matchValues(
    matchTo: string
  ): (control: AbstractControl) => ValidationErrors | null {
    return (control: any): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? null
        : { notMatching: true };
    };
  }
}
