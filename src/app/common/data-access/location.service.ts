import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';

import { APP_CONFIG } from '../app-config/app-config.token';
import { CommonResponse } from '../utils/interfaces';
import { AppConfig } from '../app-config/app.config';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LocationService {
  #httpClient = inject(HttpClient);
  #appConfig = inject(APP_CONFIG);

  getLocations() {
    return this.#httpClient.get<CommonResponse<any>>(
      `${this.#appConfig.baseURL}`
    );
  }
}
