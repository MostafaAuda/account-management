import { delay, of } from 'rxjs';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { instance, mock, reset, when } from 'ts-mockito';
import { Success } from '../../models/.common/result.model';
import { HomeBloc } from './home.bloc';
import {
  HomeEventHydrate,
  HomeStateDisconnected,
  HomeStateProcessing,
  HomeStateReady,
} from './home.bloc-model';
import { ProductModel, ProductsDTOModel } from '../../models/product.model';
import { ProductApiContract, ProductRepo } from '../../data/repo/product.repo';
import { ConnectivityServiceContract } from '../.contracts/services/connectivity.service-contract';
import { UserApiContract, UserRepo } from '../../data/repo/user.repo';
import { Router } from '@angular/router';
import { UserInfo } from '../../models/user.model';

const productsApiMoc = mock<ProductApiContract>();
const userApiMoc = mock<UserApiContract>()
const connectivityServiceMock = mock<ConnectivityServiceContract>();
const productSample = [new ProductModel('id1', 'etisalat games', 'games', 'etisalat games', 'www.etisalatgames.com', '', '', '', '', '', '', '', [new ProductsDTOModel('imgeId', '', 'games', 'games')], 120)]
const userInfoSample: UserInfo = new UserInfo('id2', 'hadeer', 'hadeer.hamdy@etisalat.com', '01121171019', '22-2-96')
// const placeholder: any = [];

describe('Home Bloc', () => {
  const productsApi = instance(productsApiMoc)
  const userApi = instance(userApiMoc)
  const connectivityService = instance(connectivityServiceMock);
  let homeBloc: HomeBloc;
  let router: Router;
  beforeEach(() => {

  })
  afterEach(() => {

    if (homeBloc) homeBloc.ngOnDestroy();
  });

  afterAll(() => {
    reset(productsApiMoc);
    reset(userApiMoc)
    reset(connectivityServiceMock);
  });

  //test cases starts
  it('should emit state Processing upone startup', () => {
    when(connectivityServiceMock.isConnected$).thenReturn(of(true));

    homeBloc = new HomeBloc(undefined!, undefined!, connectivityService, undefined!);

    const observerSpy = subscribeSpyTo(homeBloc.states$);
    expect(observerSpy.getValues()).toEqual([new HomeStateProcessing()]);
  });

  it('should emit state ready with placeholders directly after receiving Hydrate event', done => {
    when(connectivityServiceMock.isConnected$).thenReturn(of(true));
    when(productsApiMoc.getProducts()).thenReturn(
      of(new Success(productSample)).pipe(delay(10))
    );
    when(userApiMoc.getUserInfo()).thenReturn(
      of(new Success(userInfoSample)).pipe(delay(10))
    );
    const productRepo = new ProductRepo(productsApi);
    const userRepo = new UserRepo(userApi)


    homeBloc = new HomeBloc(productRepo, userRepo, connectivityService, router);

    homeBloc.events.next(new HomeEventHydrate());
    const observerSpy = subscribeSpyTo(homeBloc.states$);
    observerSpy.onComplete(() => {
      expect(observerSpy.getFirstValue()).toEqual(
        new HomeStateReady(userInfoSample, productSample)
      );
    })
    done()

  });

  it('should emit state Disconnected if there is a network issue', () => {
    when(connectivityServiceMock.isConnected$).thenReturn(of(false));

    homeBloc = new HomeBloc(undefined!, undefined!, connectivityService, router);

    const observerSpy = subscribeSpyTo(homeBloc.states$);
    expect(observerSpy.getValues()).toEqual([new HomeStateDisconnected()]);
  });


})