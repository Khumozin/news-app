import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';

import { CacheService } from '../services/cache.service';

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cache = inject(CacheService);

  const cached = cache.get(req.url);

  if (req.method !== 'GET') {
    return next(req);
  }

  const isCacheHit = cached !== undefined;
  if (isCacheHit) {
    return of(cached);
  }

  return next(req).pipe(tap(response => cache.set(req.url, response)));
};
