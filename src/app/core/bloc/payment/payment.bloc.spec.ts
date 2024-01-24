import { delay, of } from 'rxjs';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { instance, mock, reset, when } from 'ts-mockito';
import { PaymentApiContract, PaymentRepo } from '../../data/repo/payment.repo';
import { Success } from '../../models/.common/result.model';
import { ConnectivityServiceContract } from '../.contracts/services/connectivity.service-contract';
// import { LogoutNotificationServiceContract } from '../.contracts/services/logout-notification.service-contract';
import { PaymentBloc } from './payment.bloc';
import {
  PaymentEventHydrate,
  PaymentStateDisconnected,
  PaymentStateProcessing,
  PaymentStateReady,
} from './payment.bloc-model';
import {
  PaymentHistoryModel,
  PaymentMethodModel,
  PaymentMethodType,
  // PaymentModel,
} from '../../models/payment.model';
// import { ProductModel, ServiceModel } from '../../models/payment-service.model';
import { ServiceType } from '../../models/service.model';

const paymentApiMock = mock<PaymentApiContract>();
const connectivityServiceMock = mock<ConnectivityServiceContract>();
// const logoutServiceMock = mock<LogoutNotificationServiceContract>();

const paymentHistorySample = [
  new PaymentHistoryModel(ServiceType.games, 'daily games', '10', PaymentMethodType.CREADITCARD, new Date(), 'valid', '01121171019')
];
const paymentMethodsSample = [
  new PaymentMethodModel('id4', PaymentMethodType.CREADITCARD, new Date(), new Date, true, '0112171019'),

];

const placeholder: any[] = [];

describe('Payment Bloc', () => {
  const paymentApi = instance(paymentApiMock);
  const connectivityService = instance(connectivityServiceMock);
  // const logoutService = instance(logoutServiceMock);
  let paymentBloc: PaymentBloc;

  beforeEach(() => {
  });

//   afterEach(() => {
//     if (paymentBloc) paymentBloc.ngOnDestroy();
//   });

  afterAll(() => {
    reset(paymentApiMock);
    reset(connectivityServiceMock);
  });

  it('should emit state Processing upon startup', () => {
    when(connectivityServiceMock.isConnected$).thenReturn(of(true));

    paymentBloc = new PaymentBloc(undefined!, undefined!, connectivityService, undefined!, undefined!, undefined!);

//     const observerSpy = subscribeSpyTo(paymentBloc.states$);
//     expect(observerSpy.getValues()).toEqual([new PaymentStateProcessing()]);
//   });

  it('should emit state Disconnected if there is a network issue', () => {
    when(connectivityServiceMock.isConnected$).thenReturn(of(false));

    paymentBloc = new PaymentBloc(undefined!, undefined!, connectivityService, undefined!, undefined!, undefined!);

    const observerSpy = subscribeSpyTo(paymentBloc.states$);
    expect(observerSpy.getValues()).toEqual([new PaymentStateDisconnected()]);
  });

  it('should emit state ready after receiving Hydrate event', done => {
    when(connectivityServiceMock.isConnected$).thenReturn(of(true));
    when(paymentApiMock.getPaymentHistory()).thenReturn(
      of(new Success(paymentHistorySample)).pipe(delay(1))
    );
    when(paymentApiMock.getSavedPaymentMethods()).thenReturn(
      of(new Success(paymentMethodsSample)).pipe(delay(10))
    );

    const paymentRepo = new PaymentRepo(paymentApi);
    paymentBloc = new PaymentBloc(paymentRepo, undefined!, connectivityService, undefined!, undefined!, undefined!);

//     paymentBloc.events.next(new PaymentEventHydrate());
//     const observerSpy = subscribeSpyTo(paymentBloc.states$);

    observerSpy.onComplete(() => {
      expect(observerSpy.getFirstValue()).toEqual(
        new PaymentStateReady(placeholder, placeholder)

      );
    })
    done()

  });

  // it('should emit state Ready if managed to get payment methods even if failed to get payment history', async () => {
  //   // when(logoutServiceMock.logOutNotifications$).thenReturn(of(false));
  //   when(connectivityServiceMock.isConnected$).thenReturn(of(true));
  //   when(paymentApiMock.getPaymentHistory()).thenReturn(
  //     of(new Failed<PaymentModel[]>(new Error('some error'))).pipe(delay(5))
  //   );
  //   when(paymentApiMock.getSavedPaymentMethods()).thenReturn(
  //     of(new Success(paymentMethodsSample)).pipe(delay(10))
  //   );

  //   const paymentRepo = new PaymentRepo(paymentApi);
  //   paymentBloc = new PaymentBloc(paymentRepo, connectivityService);

  //   paymentBloc.events.next(new PaymentEventHydrate());
  //   const observerSpy = subscribeSpyTo(paymentBloc.states$);

  //   warnings.paymentHistory = true;
  //   warnings.message = 'some error';

  //   await new Promise((resolve) => setTimeout(resolve, 15));

  //   expect(observerSpy.getValueAt(1)).toEqual(
  //     new PaymentStateReady(placeholder, paymentMethodsSample, warnings)
  //   );
  // });

  // it('should emit state Ready if managed to get payment history even if failed to get payment methods', async () => {
  //   // when(logoutServiceMock.logOutNotifications$).thenReturn(of(false));
  //   when(connectivityServiceMock.isConnected$).thenReturn(of(true));
  //   when(paymentApiMock.getPaymentHistory()).thenReturn(
  //     of(new Success(paymentHistorySample)).pipe(delay(5))
  //   );
  //   when(paymentApiMock.getSavedPaymentMethods()).thenReturn(
  //     of(new Failed<PaymentMethodModel[]>(new Error('some error'))).pipe(
  //       delay(10)
  //     )
  //   );

  //   // const paymentRepo = new PaymentRepo(paymentApi);
  //   // paymentBloc = new PaymentBloc(paymentRepo, connectivityService);

  //   paymentBloc.events.next(new PaymentEventHydrate());
  //   const observerSpy = subscribeSpyTo(paymentBloc.states$);

  //   warnings.paymentMethods = true;
  //   warnings.message = 'some error';

  //   await new Promise((resolve) => setTimeout(resolve, 15));

  //   expect(observerSpy.getValues()).toEqual([
  //     new PaymentStateReady(placeholder, placeholder),
  //     new PaymentStateReady(paymentHistorySample, placeholder),
  //   ]);
  // });

  // it('should emit state Ready if managed to get both payment methods & history', async () => {
  //   // when(logoutServiceMock.logOutNotifications$).thenReturn(of(false));
  //   when(connectivityServiceMock.isConnected$).thenReturn(of(true));
  //   when(paymentApiMock.getPaymentHistory()).thenReturn(
  //     of(new Success(paymentHistorySample)).pipe(delay(5))
  //   );
  //   when(paymentApiMock.getSavedPaymentMethods()).thenReturn(
  //     of(new Success(paymentMethodsSample)).pipe(delay(10))
  //   );

  //   // const paymentRepo = new PaymentRepo(paymentApi);
  //   // paymentBloc = new PaymentBloc(paymentRepo, connectivityService);

  //   paymentBloc.events.next(new PaymentEventHydrate());
  //   const observerSpy = subscribeSpyTo(paymentBloc.states$);

  //   await new Promise((resolve) => setTimeout(resolve, 15));

  //   expect(observerSpy.getValues()).toEqual([
  //     new PaymentStateReady(placeholder, placeholder),
  //     new PaymentStateReady(paymentHistorySample, placeholder),
  //     new PaymentStateReady(
  //       paymentHistorySample,
  //       paymentMethodsSample
  //     ),
  //   ]);
  // });
});
