/// Result of whatever Object
/// should be used when the method should return result of Object or error with exception
export class Result<T> {
  public either<R>(
    onSuccess: (arg0: T) => R,
    onFailure: (arg0: customErrorException) => R
  ): R {
    if (this instanceof Success) {
      return onSuccess((this as Success<T>).value);
    } else if (this instanceof Failed) {
      return onFailure((this as Failed<T>).exception);
    } else {
      throw new Error('Unhandled flow!');
    }
  }

  public onSuccess(success: (arg0: T) => any): Result<T> {
    if (this instanceof Success) {
      success((this as Success<T>).value);
    }

    return this;
  }

  public onFailure(failure: (arg0: customErrorException) => any): Result<T> {
    if (this instanceof Failed) {
      failure((this as Failed<T>).exception);
    }

    return this;
  }
}

export class Success<T> extends Result<T> {
  constructor(public value: T) {
    super();
  }
}

export class Failed<T> extends Result<T> {
  constructor(public exception: customErrorException) {
    super();
  }
}

/// Completable class should be used when don't expect result, just completed or not
export class Completable {
  public either<R>(onComplete: () => R, onIncomplete: (arg0: Error) => R): R {
    if (this instanceof Complete) {
      return onComplete();
    } else if (this instanceof Incomplete) {
      return onIncomplete(this.exception);
    } else {
      throw new Error('Unhandled flow!');
    }
  }
}

export class Complete extends Completable {}

export class Incomplete extends Completable {
  constructor(public exception: Error) {
    super();
  }
}

//Added new custom Error interface
export interface customErrorException extends Error {
  error: {
    fault: {
      baseCode: number;
      code: number;
      message: string;
      meta: any;
      innerFault: any;
    } | null;
  };
}
