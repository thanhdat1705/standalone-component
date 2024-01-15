import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'location',
    pathMatch: 'full',
  },
  {
    path: 'location',
    loadComponent: () =>
      import('./location/location.component').then((c) => c.LocationComponent),
  },
];
