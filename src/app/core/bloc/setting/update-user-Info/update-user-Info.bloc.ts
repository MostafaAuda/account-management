import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Complete } from 'src/app/core/models/.common/result.model';
import { UserRepoContract } from '../../.contracts/repos/user.repo-contract';
import { ConnectivityServiceContract } from '../../.contracts/services/connectivity.service-contract';
import { LoadingSpinnerServiceContract } from '../../.contracts/services/loading-spinner.service-contract';
import {
  SnackbarServiceContract,
  snackbarType,
} from '../../.contracts/services/snackbar.service-contract';
import {
  HydrateEvent,
  SaveUpdateInfoEvent,
  UpdateInfoEvent,
  UpdateInfoEventsName,
  UpdateInfoStates,
  UpdateUserInfoReadyState,
  UpdateUserInfoProcessingState,
  UpdateUserInfoDisconnectedState,
  UpdateInfoStatesName,
} from './update-user-Info.bloc-model';

@Injectable()
export class UpdateUserInfoBloc {
  //#region Private Data Members
  private stateStream = new BehaviorSubject<UpdateInfoStates>(
    new UpdateUserInfoProcessingState()
  );
  private openSubscriptions: Subscription[] = [];
  //#endregion Private Data Members

  //#region Public Data Members
  public events = new Subject<UpdateInfoEvent>();
  public userRepoSubscription?: Subscription;
  public is_submitting$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public get states$(): Observable<UpdateInfoStates> {
    return this.stateStream.asObservable();
  }
  //#endregion Public Data Members

  //#region Framework Hooks
  constructor(
    private userRepoContract: UserRepoContract,
    private route: Router,
    private snackBar: SnackbarServiceContract,
    private connectivityService: ConnectivityServiceContract,
    private loadingSpinner: LoadingSpinnerServiceContract
  ) {
    this.subscribeViewEvents();
    this.checkConnectivityStatus();
  }

  ngOnDestroy(): void {
    this.unsubscribeOpenSubscriptions();
  }
  //#endregion Framework Hooks

  //#region Private Event Handlers
  private handleUpdateInfo(event: SaveUpdateInfoEvent): void {
    this.is_submitting$.next(true);
    this.loadingSpinner.showLoader();
    this.userRepoContract
      .setUserInfo(event?.data)
      .subscribe((result: Complete) =>
        result.either(
          () => {
            this.route.navigateByUrl('./setting');
            this.loadingSpinner.hideLoader();
            this.snackBar.show(
              'Profile info updated successfully',
              snackbarType.Success
            );
            this.is_submitting$.next(false);
          },
          (_error: Error) => {
            this.is_submitting$.next(false);
            this.loadingSpinner.hideLoader();
            this.snackBar.show(
              'Something went wrong, please try again',
              snackbarType.Error
            );
          }
        )
      );
  }

  private handleHydrate(_event: HydrateEvent): void {
    this.userRepoContract.getUserInfo().subscribe((result: Complete) =>
      result.either(
        () => {
          this.userRepoSubscription =
            this.userRepoContract.recentInfo$.subscribe();
          this.stateStream.next(
            new UpdateUserInfoReadyState(
              this.userRepoContract.recentInfoSnapshot[0]
            )
          );
        },
        () => {
          this.snackBar.show(
            'Something went wrong, please try again',
            snackbarType.Error
          );
          this.route.navigateByUrl('setting');
        }
      )
    );
  }
  //#endregion Private Event Handlers

  //#region Private Methods
  private handleIncomingEvents(event: UpdateInfoEvent): void {
    if (!event) {
      return;
    }
    switch (event.name) {
      case UpdateInfoEventsName.saveUpdateInfo:
        this.handleUpdateInfo(event as SaveUpdateInfoEvent);
        break;
      case UpdateInfoEventsName.HydrateEvent:
        this.handleHydrate(event as HydrateEvent);
        break;
    }
  }

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

  private onConnectivityChanged(isConnected: boolean): void {
    if (isConnected) {
      if (
        this.stateStream?.value?.name ===
        UpdateInfoStatesName.UpdateUserInfoDisconnectedState
      ) {
        this.stateStream.next(
          new UpdateUserInfoReadyState(
            this.userRepoContract.recentInfoSnapshot[0]
          )
        );
      }
    } else {
      this.stateStream.next(new UpdateUserInfoDisconnectedState());
    }
  }

  private unsubscribeOpenSubscriptions(): void {
    if (this.openSubscriptions.length) {
      this.openSubscriptions.forEach((sub) => sub.unsubscribe());
    }
  }
  //#endregion Private Methods
}
