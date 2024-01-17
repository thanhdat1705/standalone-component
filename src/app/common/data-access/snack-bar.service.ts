import { inject, Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarAnnotatedComponent } from '../ui';

@Injectable({ providedIn: 'root' })
export class SnackBarService {
  #snackBar = inject(MatSnackBar);

  openSnackBar(message: string, type: 'success' | 'error') {
    this.#snackBar.openFromComponent(SnackBarAnnotatedComponent, {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: 'sc-snackbar-container',
      data: {
        message: message,
        type: type,
      },
    });
  }
}
