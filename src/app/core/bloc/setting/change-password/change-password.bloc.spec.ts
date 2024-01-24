import { DisconnectedState } from 'src/app/core/bloc/setting/change-password/change-password.bloc-model';
import { ChangePasswordBloc } from 'src/app/core/bloc/setting/change-password/change-password.bloc';
import { ConnectivityServiceContract } from '../../.contracts/services/connectivity.service-contract';
import { instance, mock, reset, when } from 'ts-mockito';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { of } from 'rxjs';

const connectivityServiceMock = mock<ConnectivityServiceContract>();

describe('Change Password Bloc', () => {
  const connectivityService = instance(connectivityServiceMock);
  let changePasswordBloc: ChangePasswordBloc;

  afterEach(() => {
    if (changePasswordBloc) changePasswordBloc.ngOnDestroy();
  });

  afterAll(() => {
    reset(connectivityServiceMock);
  });

  it('should emit state Disconnected if there is a network issue', () => {
    when(connectivityServiceMock.isConnected$).thenReturn(of(false));

    changePasswordBloc = new ChangePasswordBloc(
      undefined!,
      undefined!,
      undefined!,
      connectivityService,
      undefined!
    );

    const observerSpy = subscribeSpyTo(changePasswordBloc.states$);
    expect(observerSpy.getValues()).toEqual([new DisconnectedState()]);
  });
});
