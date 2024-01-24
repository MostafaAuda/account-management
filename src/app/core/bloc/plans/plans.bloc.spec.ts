import { PlansBloc } from 'src/app/core/bloc/plans/plans.bloc';
import {
  ServiceModel,
  PlanModel,
  PlanSubModel,
} from './../../models/service.model';
import { ServicesRepo } from './../../data/repo/services.repo';
import { instance, mock, reset, when } from 'ts-mockito';
import { delay, of } from 'rxjs';
import { ServicesApiContract } from '../../data/repo/services.repo';
import { ConnectivityServiceContract } from '../.contracts/services/connectivity.service-contract';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { PlansProcessingState } from './plans.bloc-model';
import { Success } from '../../models/.common/result.model';
import {
  PlansStateReady,
  PlansEventHydrate,
  PlansStateDisconnected,
  plansCategory,
} from './plans.bloc-model';

const servicesApiMock = mock<ServicesApiContract>();
const connectivityServiceMock = mock<ConnectivityServiceContract>();

const servicesSample = [
  new ServiceModel('id1', 'name', 'serviceType', 10, 'description', 'logo', [
    new PlanModel('id2', 'name', [
      new PlanSubModel(
        'id3',
        'name',
        'description',
        'borderColor',
        'linearGradientTop',
        'linearGradientBottom',
        'price',
        'startDate',
        'endDate',
        false,
        false,
        false
      ),
    ]),
  ]),
];

const bundleSample = [
  new PlanSubModel(
    'id3',
    'name',
    'description',
    'borderColor',
    'linearGradientTop',
    'linearGradientBottom',
    'price',
    'startDate',
    'endDate',
    false,
    false,
    false
  ),
];

const categoriesSample: plansCategory[] = [
  { id: '1', name: 'Casual Games' },
  { id: '2', name: 'Esports' },
];

const activeCategorySample: plansCategory = { id: '1', name: 'Casual Games' };

describe('Plans Bloc', () => {
  const servicesApi = instance(servicesApiMock);
  const connectivityService = instance(connectivityServiceMock);
  let plansBloc: PlansBloc;

  afterEach(() => {
    if (plansBloc) plansBloc.ngOnDestroy();
  });

  afterAll(() => {
    reset(servicesApiMock);
    reset(connectivityServiceMock);
  });

  it('should emit state Processing upon startup', () => {
    when(connectivityServiceMock.isConnected$).thenReturn(of(true));

    plansBloc = new PlansBloc(
      undefined!,
      undefined!,
      undefined!,
      undefined!,
      connectivityService,
      undefined!,
      undefined!
    );

    const observerSpy = subscribeSpyTo(plansBloc.states$);
    expect(observerSpy.getValues()).toEqual([new PlansProcessingState()]);
  });

  it('should emit state ready with placeholders directly after receiving Hydrate event', (done) => {
    when(connectivityServiceMock.isConnected$).thenReturn(of(true));
    when(servicesApiMock.getPlansByType('')).thenReturn(
      of(new Success(servicesSample)).pipe(delay(100))
    );

    const servicesRepo = new ServicesRepo(servicesApi);

    plansBloc = new PlansBloc(
      undefined!,
      undefined!,
      servicesRepo,
      undefined!,
      connectivityService,
      undefined!,
      undefined!
    );

    plansBloc.events.next(new PlansEventHydrate());
    const observerSpy = subscribeSpyTo(plansBloc.states$);

    observerSpy.onComplete(() => {
      expect(observerSpy.getFirstValue()).toEqual(
        new PlansStateReady(
          'Twist Games',
          'games',
          categoriesSample,
          bundleSample,
          activeCategorySample
        )
      );
    });
    done();
  });

  it('should emit state Disconnected if there is a network issue', () => {
    when(connectivityServiceMock.isConnected$).thenReturn(of(false));

    plansBloc = new PlansBloc(
      undefined!,
      undefined!,
      undefined!,
      undefined!,
      connectivityService,
      undefined!,
      undefined!
    );

    const observerSpy = subscribeSpyTo(plansBloc.states$);
    expect(observerSpy.getValues()).toEqual([new PlansStateDisconnected()]);
  });
});
