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
  selector: 'sc-location-form-dialog',
  templateUrl: 'location-form-dialog.component.html',
  styleUrls: ['location-form-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMaskDirective,
    MatCheckboxModule,
  ],
})
export class LocationFormDialogComponent implements OnInit {
  #dialogRef = inject(MatDialogRef<LocationFormDialogComponent>);
  dialogData: Location = inject(MAT_DIALOG_DATA);

  LOCATION_STATE = LOCATION_STATE;
  formGroup = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    city: new FormControl<string>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    state: new FormControl<string>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    availableUnits: new FormControl<number | null>(null, {
      nonNullable: true,
      validators: Validators.required,
    }),
    wifi: new FormControl<boolean>(false),
    laundry: new FormControl<boolean>(false),
  });

  get form() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    if (this.dialogData) {
      this.formGroup.patchValue(this.dialogData);
    }
  }

  close(value: any): void {
    this.#dialogRef.close(value);
  }

  submitForm() {
    if (this.formGroup.invalid) {
      this.formGroup.markAsDirty();
      this.formGroup.markAllAsTouched();
      return;
    }

    if (this.dialogData) {
      //update code here
      this.close({ ...this.dialogData, ...this.formGroup.getRawValue() });
    } else {
      // create code here
      this.close(this.formGroup.getRawValue());
    }
  }
}
