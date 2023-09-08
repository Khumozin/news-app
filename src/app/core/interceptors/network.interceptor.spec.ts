import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment.development';
import { NetworkInterceptor, provideNetworkInterceptor } from './network.interceptor';

describe('NetworkInterceptor', () => {
  let httpController: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NetworkInterceptor, provideNetworkInterceptor],
    });

    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    const interceptor: NetworkInterceptor = TestBed.inject(NetworkInterceptor);
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
