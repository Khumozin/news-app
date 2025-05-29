import { EnvironmentService } from './environment.service';
import { ENVIRONMENT } from './environment.token';

export function provideEnvironmentConfig() {
  return { provide: ENVIRONMENT, useValue: new EnvironmentService() };
}
