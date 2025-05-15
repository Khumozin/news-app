import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { EnvironmentService } from '../config/environment.service';

export function networkInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const environmentService = inject(EnvironmentService);
  const apiKey = environmentService.get('APP_API_KEY');

  if (!apiKey) return next(request);

  const modifiedRequest = request.clone({
    params: request.params.append('apiKey', apiKey),
  });

  return next(modifiedRequest);
}
