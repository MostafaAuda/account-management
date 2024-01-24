import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Completable } from 'src/app/core/models/.common/result.model';
import { UserRepoContract } from '../../.contracts/repos/user.repo-contract';
import { ConnectivityServiceContract } from '../../.contracts/services/connectivity.service-contract';
import { LoadingSpinnerServiceContract } from '../../.contracts/services/loading-spinner.service-contract';
import {
  SnackbarServiceContract,
  snackbarType,
} from '../../.contracts/services/snackbar.service-contract';
import {
  ChangePasswordEvent,
  ChangePasswordEvents,
  ChangePasswordStates,
  DisconnectedState,
  ConnectedState,
  ChangePasswordStatesName,
} from './change-password.bloc-model';

@Injectable()
export class ChangePasswordBloc {
  //#region Public Data Members
  public is_submitting$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public events = new Subject<ChangePasswordEvents>();
  public get states$(): Observable<ChangePasswordStates> {
    return this.stateStream.asObservable();
  }
  //#endregion Public Data Members

  //#region Private Data Members
  private stateStream = new BehaviorSubject<ChangePasswordStates>(
    new ConnectedState()
  );
  private openSubscriptions: Subscription[] = [];
  //#endregion Private Data Members

  //#region Framework Hooks
  constructor(
    private userRepoContract: UserRepoContract,
    private route: Router,
    private snackbar: SnackbarServiceContract,
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

  //#region Private Event Handler
  private handleSaveNewPass(event: ChangePasswordEvent): void {
    this.is_submitting$.next(true);
    this.loadingSpinner.showLoader();
    const setNewPasswordSubscription = this.userRepoContract
      .setNewPassword(event.data)
      .subscribe((res: Completable) =>
        res.either(
          () => {
            this.route.navigateByUrl('./setting');
            this.loadingSpinner.hideLoader();
            this.snackbar.show(
              'Password updated successfully',
              snackbarType.Success
            );
            this.is_submitting$.next(false);
          },
          () => {
            this.loadingSpinner.hideLoader();
            //check error msg
            this.snackbar.show(
              'Something went wrong, please try again',
              snackbarType.Error
            );
            this.is_submitting$.next(false);
          }
        )
      );
    this.openSubscriptions.push(setNewPasswordSubscription);
  }
  //#endregion Private Event Handler

  //#region Private Methods
  private handleIncomingEvents(event: ChangePasswordEvents): void {
    if (!event) {
      return;
    }
    this.handleSaveNewPass(event as ChangePasswordEvent);
  }

  private unsubscribeOpenSubscriptions(): void {
    if (this.openSubscriptions.length) {
      this.openSubscriptions.forEach((sub) => sub.unsubscribe());
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
        ChangePasswordStatesName.DisconnectedState
      ) {
        this.stateStream.next(new ConnectedState());
      }
    } else {
      this.stateStream.next(new DisconnectedState());
    }
  }
  //#endregion Private Methods
}
