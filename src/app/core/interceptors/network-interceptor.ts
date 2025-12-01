import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CONFIG } from '../config/config';

export function networkInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const config = inject(CONFIG);
  const apiKey = config.get('APP_API_KEY');

  if (!apiKey) return next(request);

  const modifiedRequest = request.clone({
    params: request.params.append('apiKey', apiKey),
  });

  return next(modifiedRequest);
}
