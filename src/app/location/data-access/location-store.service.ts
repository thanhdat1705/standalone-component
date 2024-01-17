import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { switchMap, tap, withLatestFrom } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';

import { LocationService, SnackBarService } from '../../common/data-access';
import { compare, filterLocationHandler } from '../../common/utils/helper';
import { Location, LocationFilter } from '../../common/utils/interfaces';
import { LocationFormDialogComponent } from '../ui';

interface State {
  isLoading: boolean;
  totalLocations: number;
  data: Location[];
  filter: LocationFilter;
}

@Injectable()
export class LocationsStore extends ComponentStore<State> {
  #ngxLoader = inject(NgxUiLoaderService);
  #locationService = inject(LocationService);
  #snackBar = inject(SnackBarService);
  #dialog = inject(MatDialog);

  constructor() {
    super({
      isLoading: false,
      totalLocations: 0,
      data: [],
      filter: {
        search: '',
      },
    });
  }

  readonly data$ = this.select((state) => state.data);
  readonly totalLocations$ = this.select((state) => state.totalLocations);
  readonly filter$ = this.select((state) => state.filter);

  readonly vm$ = this.select(
    this.data$,
    this.totalLocations$,
    this.filter$,
    (data, totalLocations, filter) => ({ data, totalLocations, filter })
  );

  getListLocations = this.effect<{
    filter?: Partial<LocationFilter>;
  }>((params$) =>
    params$.pipe(
      tap(() => this.#ngxLoader.start()),
      withLatestFrom(this.vm$),
      switchMap(([{ filter }, vm]) => {
        const newFilter = {
          ...vm.filter,
          ...filter,
        };

        if (newFilter.state === 'None') delete newFilter.state;

        return this.#locationService.getLocations().pipe(
          tapResponse(
            (response) => {
              const filter = filterLocationHandler(newFilter, response);

              this.patchState({
                data: filter.filterData,
                totalLocations: response.length,
                filter: newFilter,
              });

              if (newFilter.sortBy || newFilter.sortDirection) {
                this.sortData({
                  sortBy: newFilter.sortBy,
                  sortDirection: newFilter.sortDirection,
                });
              }

              this.#ngxLoader.stop();
            },
            (error: HttpErrorResponse) => this.#errorHandler(error)
          )
        );
      })
    )
  );

  createLocation = this.effect<Location>((location$) =>
    location$.pipe(
      tap(() => this.#ngxLoader.start()),
      switchMap((location) =>
        this.#locationService.createLocation(location).pipe(
          tapResponse(
            (response) => {
              this.#snackBar.openSnackBar('Create Successfully', 'success');
              this.getListLocations({});
            },
            (error: HttpErrorResponse) => this.#errorHandler(error)
          )
        )
      )
    )
  );

  updateLocation = this.effect<Location>((location$) =>
    location$.pipe(
      tap(() => this.#ngxLoader.start()),
      withLatestFrom(this.vm$),
      switchMap(([location, vm]) =>
        this.#locationService.updateLocation(location).pipe(
          tapResponse(
            (response) => {
              this.#snackBar.openSnackBar('Update Successfully', 'success');
              this.getListLocations({ filter: vm.filter });
            },
            (error: HttpErrorResponse) => this.#errorHandler(error)
          )
        )
      )
    )
  );

  deleteLocation = this.effect<string>((locationId$) =>
    locationId$.pipe(
      tap(() => this.#ngxLoader.start()),
      withLatestFrom(this.vm$),
      switchMap(([locationId, vm]) =>
        this.#locationService.deleteLocation(locationId).pipe(
          tapResponse(
            (response) => {
              this.#snackBar.openSnackBar('Delete Successfully', 'success');
              this.getListLocations({ filter: vm.filter });
            },
            (error: HttpErrorResponse) => this.#errorHandler(error)
          )
        )
      )
    )
  );

  getLocationDetails = this.effect<string>((locationId$) =>
    locationId$.pipe(
      tap(() => this.#ngxLoader.start()),
      switchMap((locationId) =>
        this.#locationService.getLocationById(locationId).pipe(
          tapResponse(
            (response) => {
              this.#dialog.open(LocationFormDialogComponent, {
                width: '400px',
                data: response,
                disableClose: true,
              });

              this.#ngxLoader.stop();
            },
            (error: HttpErrorResponse) => this.#errorHandler(error)
          )
        )
      )
    )
  );

  readonly sortData = this.updater<{
    sortBy: string | undefined;
    sortDirection: string | undefined;
  }>((state, { sortBy, sortDirection }) => {
    let sortedData = state.data.slice();
    if (!sortBy || sortDirection === '') {
      return state;
    }

    sortedData = sortedData.sort((a, b) => {
      const isAsc = sortDirection === 'asc';
      switch (sortBy) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'city':
          return compare(a.city, b.city, isAsc);
        case 'state':
          return compare(a.state, b.state, isAsc);
        case 'availableUnits':
          return compare(a.availableUnits, b.availableUnits, isAsc);
        default:
          return 0;
      }
    });

    return {
      ...state,
      data: sortedData,
      filter: {
        ...state.filter,
        sortBy,
        sortDirection,
      },
    };
  });

  #errorHandler(error: HttpErrorResponse): void {
    this.#snackBar.openSnackBar('Error', 'error');
    this.#ngxLoader.stop();
    throw error;
  }
}
