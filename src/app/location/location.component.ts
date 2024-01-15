import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { MatMenuModule } from '@angular/material/menu';
import { DataGridComponent } from '../data-grid';
import { LocationService } from '../common/data-access';

@Component({
  selector: 'sc-location',
  templateUrl: 'location.component.html',
  styleUrls: ['location.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataGridComponent],
})
export class LocationComponent implements OnInit {
  #locationService = inject(LocationService);

  ngOnInit(): void {
      this.#locationService.getLocations().subscribe((res) => console.log('response', res))
  }
}
