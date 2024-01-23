import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';

export function networkInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const apiKey = environment.apiKey;

  const modifiedRequest = request.clone({
    params: request.params.append('apiKey', apiKey),
  });

  return next(modifiedRequest);
}
