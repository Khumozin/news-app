import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { inject, provideAppInitializer } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routing';
import { EnvironmentService } from './app/core/config/environment.service';
import { networkInterceptor } from './app/core/interceptors';

function initApp() {
  const environmentService = inject(EnvironmentService);

  return environmentService.load();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideAppInitializer(initApp),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([networkInterceptor])),
    provideRouter(APP_ROUTES),
    {
      provide: EnvironmentService,
      useValue: new EnvironmentService(),
    },
  ],
}).catch(err => console.error(err));
