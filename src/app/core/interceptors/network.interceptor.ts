import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {
  private readonly apiKey = environment.apiKey;

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const modifiedRequest = request.clone({
      params: request.params.append('apiKey', this.apiKey),
    });

    return next.handle(modifiedRequest);
  }
}

export const provideNetworkInterceptor: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: NetworkInterceptor,
  multi: true,
};
