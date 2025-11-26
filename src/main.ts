import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routing';
import { provideEnvironmentConfig } from './app/core/config/environment.provider';
import { ENVIRONMENT } from './app/core/config/environment.token';
import { cacheInterceptor } from './app/core/interceptors/cache.interceptor';
import { networkInterceptor } from './app/core/interceptors/network.interceptor';

function initApp() {
  const environmentService = inject(ENVIRONMENT);

  return environmentService.load();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideAppInitializer(initApp),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([networkInterceptor, cacheInterceptor])),
    provideRouter(APP_ROUTES),
    provideEnvironmentConfig(),
  ],
}).catch(err => console.error(err));
