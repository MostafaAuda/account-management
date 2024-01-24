import { UserRepoContract } from '../../bloc/.contracts/repos/user.repo-contract';
import { Injectable } from '@angular/core';
import { UserChangePassword, UserInfo } from '../../models/user.model';
import { BehaviorSubject, map, Observable } from 'rxjs';
import {
  Completable,
  Complete,
  Incomplete,
  Result,
} from 'src/app/core/models/.common/result.model';

export abstract class UserApiContract {
  abstract getUserInfo(): Observable<Result<UserInfo>>;
  abstract setUserInfo(payload: UserInfo): Observable<Completable>;
  abstract setNewPassword(data: UserChangePassword): Observable<Completable>;
}

@Injectable()
export class UserRepo implements UserRepoContract {
  //#region Private Data Members
  private recentUserInfoStream = new BehaviorSubject<UserInfo[]>([]);
  //#endregion private Data Members

  //#region Public Data Members
  public get recentInfo$(): Observable<UserInfo[]> {
    return this.recentUserInfoStream.asObservable();
  }
  public get recentInfoSnapshot(): UserInfo[] {
    return this.recentUserInfoStream.value;
  }
  //#endregion Public Data Members

  //#region framework Hooks
  constructor(private userApiContract: UserApiContract) {}
  //#endregion framework Hooks

  //#region Public Methods
  public setUserInfo(data: UserInfo): Observable<Completable> {
    return this.userApiContract.setUserInfo(data).pipe(
      map((value) =>
        value.either(
          () => {
            return new Complete();
          },
          (error: any) => new Incomplete(error)
        )
      )
    );
  }

  public getUserInfo(): Observable<Completable> {
    // HINT: invalidating cache with pre loading placeholders
    this.recentUserInfoStream.next([]);

    return this.userApiContract.getUserInfo().pipe(
      map((RecentuserInfo: Result<UserInfo>) =>
        RecentuserInfo.either(
          // success
          (data: UserInfo) => {
            this.recentUserInfoStream.next([data]);
            return new Complete();
          },
          // failure
          (error: Error) => new Incomplete(error)
        )
      )
    );
  }

  //to change the password
  public setNewPassword(data: UserChangePassword) {
    return this.userApiContract.setNewPassword(data).pipe(
      map((value) =>
        value.either(
          () => {
            return new Complete();
          },
          // failure
          (error: Error) => new Incomplete(error)
        )
      )
    );
  }
  //#endregion Public Methods
}
