import { Injectable } from '@angular/core';

import { Environment } from './environment.interface';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  private config?: Environment;

  load(): Promise<Environment> {
    return fetch('assets/config.json')
      .then(res => res.json())
      .then((data: Environment) => (this.config = data));
  }

  get(key: keyof Environment): string | undefined {
    return this.config?.[key];
  }
}
