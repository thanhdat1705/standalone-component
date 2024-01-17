import { CommonModule } from '@angular/common';
import { Component, HostBinding, Inject, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarConfig,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'sc-snack-bar-annotated',
  templateUrl: 'snack-bar-annotated.component.html',
  styleUrls: ['snack-bar-annotated.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    MatIconModule,
  ],
})
export class SnackBarAnnotatedComponent {
  snackBarRef = inject(MatSnackBarRef);

  constructor(@Inject(MAT_SNACK_BAR_DATA) public snackBarData: any) {}

  @HostBinding('class') get snackBarStatus() {
    return this.snackBarData.type === 'success' ? 'success' : 'error';
  }
}
