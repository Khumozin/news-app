import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment.development';
import { networkInterceptor } from './network.interceptor';

describe('NetworkInterceptor', () => {
  let httpController: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptors([networkInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should be created', () => {
    const interceptor: HttpInterceptorFn = (req, next) =>
      TestBed.runInInjectionContext(() => networkInterceptor(req, next));

    expect(interceptor).toBeTruthy();
  });

  it('should add the API key as a query parameter', () => {
    const apiKey = environment.apiKey;
    const testUrl = environment.newApiUrl;
    const expectedUrl = `${testUrl}?apiKey=${apiKey}`;

    http.get(testUrl).subscribe();

    const req = httpController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');

    req.flush({});
  });
});
