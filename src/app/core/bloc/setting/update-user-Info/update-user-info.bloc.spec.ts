import { UserRepo } from './../../../data/repo/user.repo';
import {
  HydrateEvent,
  UpdateUserInfoDisconnectedState,
  UpdateUserInfoReadyState,
} from './update-user-Info.bloc-model';
import { ConnectivityServiceContract } from '../../.contracts/services/connectivity.service-contract';
import { instance, mock, reset, when } from 'ts-mockito';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { delay, of } from 'rxjs';
import { UpdateUserInfoBloc } from './update-user-Info.bloc';
import { UserApiContract } from 'src/app/core/data/repo/user.repo';
import { Success } from 'src/app/core/models/.common/result.model';
import { UserInfo } from 'src/app/core/models/user.model';

const userApiMock = mock<UserApiContract>();
const connectivityServiceMock = mock<ConnectivityServiceContract>();

const userInfoSample = new UserInfo('id', '', '', '', '');

describe('Update User Info Bloc', () => {
  const userApi = instance(userApiMock);
  const connectivityService = instance(connectivityServiceMock);
  let updateUserInfoBloc: UpdateUserInfoBloc;

  afterEach(() => {
    if (updateUserInfoBloc) updateUserInfoBloc.ngOnDestroy();
  });

  afterAll(() => {
    reset(userApiMock);
    reset(connectivityServiceMock);
  });

  it('should emit state ready with placeholders directly after receiving Hydrate event', (done) => {
    when(connectivityServiceMock.isConnected$).thenReturn(of(true));
    when(userApiMock.getUserInfo()).thenReturn(
      of(new Success(userInfoSample)).pipe(delay(100))
    );

    const userRepo = new UserRepo(userApi);

    updateUserInfoBloc = new UpdateUserInfoBloc(
      userRepo,
      undefined!,
      undefined!,
      connectivityService,
      undefined!
    );

    updateUserInfoBloc.events.next(new HydrateEvent());
    const observerSpy = subscribeSpyTo(updateUserInfoBloc.states$);

    observerSpy.onComplete(() => {
      expect(observerSpy.getFirstValue()).toEqual(
        new UpdateUserInfoReadyState(userInfoSample)
      );
    });
    done();
  });

  it('should emit state Disconnected if there is a network issue', () => {
    when(connectivityServiceMock.isConnected$).thenReturn(of(false));

    updateUserInfoBloc = new UpdateUserInfoBloc(
      undefined!,
      undefined!,
      undefined!,
      connectivityService,
      undefined!
    );

    const observerSpy = subscribeSpyTo(updateUserInfoBloc.states$);
    expect(observerSpy.getValues()).toEqual([
      new UpdateUserInfoDisconnectedState(),
    ]);
  });
});
