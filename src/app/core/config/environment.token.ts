import { InjectionToken } from '@angular/core';

import { Environment } from './environment.interface';

interface EnvironmentToken {
  load(): Promise<Environment>;
  get(key: keyof Environment): string | undefined;
}

export const ENVIRONMENT = new InjectionToken<EnvironmentToken>(
  'App Environment Config'
);
