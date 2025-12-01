import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CONFIG, provideConfig } from './core/config/config';
import { ThemeService } from './core/services/theme-service';
import { networkInterceptor } from './core/interceptors/network-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      inject(CONFIG).load();
    }),
    provideAppInitializer(() => {
      inject(ThemeService);
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([networkInterceptor])),
    provideConfig(),
  ],
};
