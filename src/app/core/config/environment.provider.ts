import { inject } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { ENVIRONMENT } from './environment.token';

export function provideEnvironmentConfig() {
  return { provide: ENVIRONMENT, useFactory: () => inject(EnvironmentService) };
}
