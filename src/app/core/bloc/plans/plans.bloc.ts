import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Completable } from '../../models/.common/result.model';
import { PlanSubModel, ServiceModel } from '../../models/service.model';
import { ServicesRepoContract } from '../.contracts/repos/services.repo-contract';
import {
  ConfirmationDialogServiceContract,
  IconTypes,
} from '../.contracts/services/confirm-dialog.service-contract';
import { ConnectivityServiceContract } from '../.contracts/services/connectivity.service-contract';
import { LoadingSpinnerServiceContract } from '../.contracts/services/loading-spinner.service-contract';
import {
  SnackbarServiceContract,
  snackbarType,
} from '../.contracts/services/snackbar.service-contract';
import {
  ChangeCategoryEvent,
  PlansEventHydrate,
  PlansProcessingState,
  PlansStateDisconnected,
  PlansStateEmpty,
  PlansStateError,
  PlansEvent,
  PlansEventName,
  PlansStateReady,
  PlansState,
  SubscribeEvent,
  UnsubscribeEvent,
  plansCategory,
  ViewPlanDetailsEvent,
  PlansStateName,
} from './plans.bloc-model';

@Injectable()
export class PlansBloc {
  //#region Private Data Members
  private stateStream = new BehaviorSubject<PlansState>(
    new PlansProcessingState()
  );
  private isErrorState: boolean = false;
  private openSubscriptions: Subscription[] = [];
  private plan: ServiceModel;
  private plansCategories: plansCategory[] = [];
  private plansTypeDTO: PlanSubModel[] = [];
  private activeCategory: plansCategory = {
    id: '',
    name: '',
  };
  private categoryID: string;
  //#endregion Private Data Members

  //#region Public Data Members
  public events = new Subject<PlansEvent>();
  public get states$(): Observable<PlansState> {
    return this.stateStream.asObservable();
  }
  public serviceType: string = '';
  //#endregion Public Data Members

  //#region Framework Hooks
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private plansRepo: ServicesRepoContract,
    private snackBar: SnackbarServiceContract,
    private connectivityService: ConnectivityServiceContract,
    private confirmDialog: ConfirmationDialogServiceContract,
    private loadingSpinner: LoadingSpinnerServiceContract
  ) {
    this.getRouteParam();
    this.subscribeViewEvents();
    this.checkConnectivityStatus();
  }

  public ngOnDestroy(): void {
    this.unsubscribeOpenSubscriptions();
  }
  //#endregion  Framework Hooks

  //#region Private Methods
  private subscribeViewEvents(): void {
    const eventsSubscription = this.events.subscribe((event) =>
      this.handleIncomingEvents(event)
    );
    this.openSubscriptions.push(eventsSubscription);
  }

  private checkConnectivityStatus(): void {
    const connectionCheckingSubscription =
      this.connectivityService.isConnected$.subscribe((connected) =>
        this.onConnectivityChanged(connected)
      );

    this.openSubscriptions.push(connectionCheckingSubscription);
  }

  private unsubscribeOpenSubscriptions(): void {
    if (this.openSubscriptions?.length) {
      this.openSubscriptions?.forEach((sub) => sub?.unsubscribe());
    }
  }

  private onConnectivityChanged(isConnected: boolean): void {
    if (isConnected) {
      if (
        this.stateStream?.value?.name === PlansStateName.PlansDisconnectedState
      ) {
        if (!this.isErrorState) {
          this.stateStream.next(
            new PlansStateReady(
              this.plan.name,
              this.plan.serviceType,
              this.plansCategories,
              this.plansTypeDTO,
              this.activeCategory
            )
          );
        } else {
          this.stateStream.next(new PlansStateError());
        }
      }
    } else {
      this.stateStream.next(new PlansStateDisconnected());
    }
  }

  private getRouteParam(): void {
    const routeParamSub = this.route?.params?.subscribe((param?: any) => {
      this.serviceType = param?.serviceType;
    });

    const routeQueryParamSub = this.route?.queryParams?.subscribe(
      (queryParam?: any) => {
        if (queryParam?.categoryID) {
          this.categoryID = queryParam?.categoryID;
          this.onFilterCategory(this.categoryID);
        }
      }
    );

    this.openSubscriptions.push(routeParamSub);
    this.openSubscriptions.push(routeQueryParamSub);
  }

  private onFetchPlans(plan: ServiceModel): void {
    if (!plan) {
      this.stateStream.next(new PlansStateEmpty());
    } else {
      //to push all categories to plansCategories array
      this.plansCategories = [];
      plan?.plansTypeDTO?.forEach((el) => {
        let category: plansCategory = {
          id: el?.id,
          name: el?.name,
        };
        this.plansCategories.push(category);
      });

      if (this.categoryID) {
        this.onFilterCategory(this.categoryID);
      } else {
        this.onFilterCategory(this.plansCategories[0].id);
      }
    }
  }

  private onFilterCategory(categoryID: string): void {
    if (categoryID) {
      this.router?.navigate(['/plans', this.serviceType], {
        queryParams: {
          categoryID: categoryID,
        },
      });
    }

    this.plansTypeDTO = [];
    this.plan?.plansTypeDTO?.forEach((plan) => {
      if (plan.id == categoryID) {
        this.plansTypeDTO?.push(...plan.plansSubTypeDTO);
        this.activeCategory.id = plan.id;
        this.activeCategory.name = plan.name;
      }
    });
    if (this.plansTypeDTO?.length) {
      this.stateStream.next(
        new PlansStateReady(
          this.plan.name,
          this.plan.serviceType,
          this.plansCategories,
          this.plansTypeDTO,
          this.activeCategory
        )
      );
    } else {
      this.stateStream.next(new PlansProcessingState());
    }
  }
  //#endregion Private Methods

  //#region Private Event Handler
  private handleIncomingEvents(event: PlansEvent): void {
    if (!event) {
      return;
    }

    switch (event.name) {
      case PlansEventName.PlansEventHydrate:
        this.handleHydrate(event as PlansEventHydrate);
        break;
      case PlansEventName.SubscribeEvent:
        this.handleSubscribe(event as SubscribeEvent);
        break;
      case PlansEventName.UnsubscribeEvent:
        this.handleUnsubscribe(event as UnsubscribeEvent);
        break;
      case PlansEventName.ChangeCategoryEvent:
        this.handleOnChangeCategory(event as ChangeCategoryEvent);
        break;
      case PlansEventName.ViewPlanDetailsEvent:
        this.handleViewDetails(event as ViewPlanDetailsEvent);
    }
  }

  private handleHydrate(_event?: PlansEventHydrate): void {
    this.plansRepo
      .getPlansByType(this.serviceType)
      .subscribe((plansResult: Completable) =>
        plansResult.either(
          () => {
            this.isErrorState = false;
            this.plan = this.plansRepo.servicesSnapshot[0];
            this.onFetchPlans(this.plan);
          },
          () => {
            this.isErrorState = true;
            this.stateStream.next(new PlansStateError());
          }
        )
      );
  }

  private handleSubscribe(_event: SubscribeEvent): void {
    this.confirmDialog.showConfirmationDialog({
      title: 'Are you sure you want to subscribe?',
      iconType: IconTypes.Success,
      confirmFunction: this.confirmSubscribe.bind(this, _event),
    });
  }

  private confirmSubscribe(_event: SubscribeEvent): void {
    this.loadingSpinner.showLoader();
    this.plansRepo
      .subscribeBundle(_event.bundleID, _event.bundleName)
      .subscribe((result) => {
        result.either(
          // success
          () => {
            this.stateStream.next(new PlansEventHydrate());
            this.loadingSpinner.hideLoader();
            this.snackBar.show('Succesfully subscribed!', snackbarType.Success);
          },
          // error
          (_error) => {
            this.loadingSpinner.hideLoader();
            this.snackBar.show(
              'Something went wrong, please try again',
              snackbarType.Error
            );
          }
        );
      });
  }

  private handleUnsubscribe(_event: UnsubscribeEvent): void {
    this.confirmDialog.showConfirmationDialog({
      title: 'Are you sure you want to cancel subscription?',
      iconType: IconTypes.Disapprove,
      confirmFunction: this.confirmUnSubscribe.bind(this, _event),
    });
  }

  private confirmUnSubscribe(_event: UnsubscribeEvent): void {
    this.loadingSpinner.showLoader();
    this.plansRepo
      .unsubscribeBundle(_event.bundleID, _event.bundleName)
      .subscribe((result) => {
        result.either(
          // success
          () => {
            this.stateStream.next(new PlansEventHydrate());
            this.loadingSpinner.hideLoader();
            this.snackBar.show(
              'Succesfully unsubscribed!',
              snackbarType.Success
            );
          },
          // error
          (_error) => {
            this.loadingSpinner.hideLoader();
            this.snackBar.show(
              'Something went wrong, please try again',
              snackbarType.Error
            );
          }
        );
      });
  }

  private handleOnChangeCategory(_event: ChangeCategoryEvent): void {
    this.onFilterCategory(_event.id);
  }

  private handleViewDetails(event: ViewPlanDetailsEvent): void {
    if (event.categoryID) {
      this.router.navigate(['/plans', event.serviceType], {
        queryParams: {
          categoryID: event.categoryID,
        },
      });
    } else {
      this.router.navigate(['/plans', event.serviceType]);
    }
  }
  //#endregion Private Event Handler
}
