import { UserSubscriptionsRepo } from './../../data/repo/user-subscriptions.repo';
import { UserSubscriptionsModel } from './../../models/user-subscriptions.model';
import {
  ServiceModel,
  PlanModel,
  PlanSubModel,
} from './../../models/service.model';
import { ServicesRepo } from './../../data/repo/services.repo';
import {
  PlansSubscriptionsStateProcessing,
  PlansSubscriptionsEventHydrate,
  PlansSubscriptionsStateReady,
  PlansSubscriptionsStateDisconnected,
} from './plans-subscriptions.bloc-model';
import { instance, mock, reset, when } from 'ts-mockito';
import { delay, of } from 'rxjs';
import { ServicesApiContract } from '../../data/repo/services.repo';
import { ConnectivityServiceContract } from '../.contracts/services/connectivity.service-contract';
import { PlansSubscriptionsBloc } from './plans-subscriptions.bloc';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { UserSubscriptionsApiContract } from '../../data/repo/user-subscriptions.repo';
import { Success } from '../../models/.common/result.model';

const servicesApiMock = mock<ServicesApiContract>();
const userSubscriptionsApiMock = mock<UserSubscriptionsApiContract>();
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

const userSubscriptionSample = [
  new UserSubscriptionsModel(
    'id',
    'serviceType',
    'planTypeID',
    'bundleID',
    'bundle',
    'price',
    'nextBillingDate'
  ),
];

describe('Plans Subscriptions Bloc', () => {
  const servicesApi = instance(servicesApiMock);
  const userSubscriptionsApi = instance(userSubscriptionsApiMock);
  const connectivityService = instance(connectivityServiceMock);
  let plansSubscriptionsBloc: PlansSubscriptionsBloc;

  afterEach(() => {
    if (plansSubscriptionsBloc) plansSubscriptionsBloc.ngOnDestroy();
  });

  afterAll(() => {
    reset(servicesApiMock);
    reset(userSubscriptionsApiMock);
    reset(connectivityServiceMock);
  });

  it('should emit state Processing upon startup', () => {
    when(connectivityServiceMock.isConnected$).thenReturn(of(true));

    plansSubscriptionsBloc = new PlansSubscriptionsBloc(
      undefined!,
      undefined!,
      connectivityService,
      undefined!,
      undefined!,
      undefined!,
      undefined!
    );

    const observerSpy = subscribeSpyTo(plansSubscriptionsBloc.states$);
    expect(observerSpy.getValues()).toEqual([
      new PlansSubscriptionsStateProcessing(),
    ]);
  });

  it('should emit state ready with placeholders directly after receiving Hydrate event', (done) => {
    when(connectivityServiceMock.isConnected$).thenReturn(of(true));
    when(servicesApiMock.getServices()).thenReturn(
      of(new Success(servicesSample)).pipe(delay(300))
    );
    when(userSubscriptionsApiMock.getUserSubscriptions()).thenReturn(
      of(new Success(userSubscriptionSample)).pipe(delay(400))
    );

    const servicesRepo = new ServicesRepo(servicesApi);
    const userSubscriptionsRepo = new UserSubscriptionsRepo(
      userSubscriptionsApi
    );
    plansSubscriptionsBloc = new PlansSubscriptionsBloc(
      servicesRepo,
      userSubscriptionsRepo,
      connectivityService,
      undefined!,
      undefined!,
      undefined!,
      undefined!
    );

    plansSubscriptionsBloc.events.next(new PlansSubscriptionsEventHydrate());
    const observerSpy = subscribeSpyTo(plansSubscriptionsBloc.states$);
    observerSpy.onComplete(() => {
      expect(observerSpy.getFirstValue()).toEqual(
        new PlansSubscriptionsStateReady(servicesSample, userSubscriptionSample)
      );
    });
    done();
  });

  it('should emit state Disconnected if there is a network issue', () => {
    when(connectivityServiceMock.isConnected$).thenReturn(of(false));

    plansSubscriptionsBloc = new PlansSubscriptionsBloc(
      undefined!,
      undefined!,
      connectivityService,
      undefined!,
      undefined!,
      undefined!,
      undefined!
    );

    const observerSpy = subscribeSpyTo(plansSubscriptionsBloc.states$);
    expect(observerSpy.getValues()).toEqual([
      new PlansSubscriptionsStateDisconnected(),
    ]);
  });
});
