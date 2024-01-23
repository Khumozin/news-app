import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routing';
import { networkInterceptor } from './app/core/interceptors';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom([BrowserAnimationsModule]),
    provideAnimations(),
    provideHttpClient(withInterceptors([networkInterceptor])),
    provideRouter(APP_ROUTES),
  ],
}).catch((err) => console.error(err));
