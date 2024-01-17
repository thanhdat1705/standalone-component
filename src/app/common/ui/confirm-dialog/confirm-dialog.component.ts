import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LOCATION_STATE } from '../../../common/utils/constants';
import { NgxMaskDirective } from 'ngx-mask';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Location } from '../../../common/utils/interfaces';

@Component({
  selector: 'sc-confirm-dialog',
  templateUrl: 'confirm-dialog.component.html',
  styles: [
    `
      h1 {
        font-size: 20px;
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatDialogModule],
})
export class ConfirmDialogComponent {
  dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
}
