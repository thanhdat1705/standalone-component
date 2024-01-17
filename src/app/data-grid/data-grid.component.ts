import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxMaskDirective } from 'ngx-mask';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { ConfirmDialogComponent } from '../common/ui';
import { LOCATION_STATE } from '../common/utils/constants';
import { Location } from '../common/utils/interfaces';
import { LocationsStore } from '../location/data-access';
import { LocationFormDialogComponent } from '../location/ui';

@Component({
  selector: 'sc-data-grid',
  templateUrl: 'data-grid.component.html',
  styleUrls: ['data-grid.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgxMaskDirective,
  ],
})
export class DataGridComponent implements OnInit {
  #dialog = inject(MatDialog);
  locationStore = inject(LocationsStore);

  dataSource$ = this.locationStore.data$;

  displayedColumns: string[] = [
    'name',
    'city',
    'state',
    'availableUnits',
    'actions',
  ];
  searchControl: FormControl = new FormControl('');
  LOCATION_STATE = LOCATION_STATE;

  ngOnInit(): void {
    this.locationStore.getListLocations({});
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query: string) => {
        this.locationStore.getListLocations({ filter: { search: query } });
      });
  }

  sortChange(sort: Sort) {
    this.locationStore.sortData({
      sortBy: sort.active,
      sortDirection: sort.direction,
    });
  }

  onOpenDetails(data: Location) {
    const dialogRef = this.#dialog.open(LocationFormDialogComponent, {
      width: '400px',
      data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: Location) => {
      if (result) this.locationStore.updateLocation(result);
    });
  }

  onDelete(id: string) {
    const dialogRef = this.#dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.locationStore.deleteLocation(id);
      }
    });
  }

  onStateChange(state: string) {
    this.locationStore.getListLocations({ filter: { state } });
  }
}
