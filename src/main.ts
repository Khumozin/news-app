import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routing';
import { provideNetworkInterceptor } from './app/core/interceptors';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom([BrowserAnimationsModule]),
    provideNetworkInterceptor,
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(APP_ROUTES),
  ],
}).catch((err) => console.error(err));
