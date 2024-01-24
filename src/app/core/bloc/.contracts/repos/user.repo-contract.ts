import { Observable } from 'rxjs';
import { Completable } from 'src/app/core/models/.common/result.model';
import { UserChangePassword, UserInfo } from 'src/app/core/models/user.model';

export abstract class UserRepoContract {
  abstract getUserInfo(): Observable<Completable>;
  abstract setUserInfo(data: UserInfo): Observable<Completable>;
  abstract setNewPassword(data: UserChangePassword): Observable<Completable>;
  abstract recentInfo$: Observable<UserInfo[]>;
  abstract recentInfoSnapshot: UserInfo[];
}
