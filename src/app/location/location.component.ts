import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { v4 as uuid } from 'uuid';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { DataGridComponent } from '../data-grid';
import { LocationsStore } from './data-access';
import { LocationFormDialogComponent } from './ui';

@Component({
  selector: 'sc-location',
  templateUrl: 'location.component.html',
  styleUrls: ['location.component.scss'],
  standalone: true,
  providers: [LocationsStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataGridComponent, MatButtonModule, MatDialogModule],
})
export class LocationComponent {
  #dialog = inject(MatDialog);
  #locationStore = inject(LocationsStore);

  onCreate(): void {
    const dialogRef = this.#dialog.open(LocationFormDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.#locationStore.createLocation({
          ...result,
          id: uuid(),
          photo:
            'https://angular.io/assets/images/tutorials/faa/r-architecture-GGupkreKwxA-unsplash.jpg',
        });
      }
    });
  }
}
