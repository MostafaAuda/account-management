import { DisconnectedState } from './setting-page.bloc-model';
import { ConnectivityServiceContract } from '../../.contracts/services/connectivity.service-contract';
import { SettingPageBloc } from './setting-page.bloc';
import { instance, mock, reset, when } from 'ts-mockito';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { of } from 'rxjs';

const connectivityServiceMock = mock<ConnectivityServiceContract>();

describe('Setting Page Bloc', () => {
  const connectivityService = instance(connectivityServiceMock);
  let settingBloc: SettingPageBloc;

  afterEach(() => {
    if (settingBloc) settingBloc.ngOnDestroy();
  });

  afterAll(() => {
    reset(connectivityServiceMock);
  });

  it('should emit state Disconnected if there is a network issue', () => {
    when(connectivityServiceMock.isConnected$).thenReturn(of(false));

    settingBloc = new SettingPageBloc(
      undefined!,
      undefined!,
      connectivityService
    );

    const observerSpy = subscribeSpyTo(settingBloc.states$);
    expect(observerSpy.getValues()).toEqual([new DisconnectedState()]);
  });
});
