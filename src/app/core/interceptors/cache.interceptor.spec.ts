import {
  HttpClient,
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { Environment } from '../config/environment.interface';
import { EnvironmentService } from '../config/environment.service';
import { ENVIRONMENT } from '../config/environment.token';
import { cacheInterceptor } from './cache.interceptor';

const environmentMock = {
  APP_API_URL: 'https://api.test.dev',
  APP_API_KEY: 'APIKEY',
};

describe('cacheInterceptor', () => {
  let httpController: HttpTestingController;
  let http: HttpClient;
  let env: EnvironmentService;

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => cacheInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptors([cacheInterceptor])),
        provideHttpClientTesting(),
        {
          provide: ENVIRONMENT,
          useValue: {
            load: () => firstValueFrom(of(environmentMock)),
            get: (key: keyof Environment) => environmentMock[key],
          },
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
    env = TestBed.inject(ENVIRONMENT);

    env.load().then();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add to cache', () => {
    const apiKey = env.get('APP_API_KEY')!;
    const testUrl = env.get('APP_API_URL')!;
    const expectedUrl = `${testUrl}?apiKey=${apiKey}`;

    const mock = {
      articles: [],
      status: 'ok',
      totalResults: 0,
    };

    http.get(expectedUrl).subscribe({
      next: res => {
        expect((res as typeof mock).status).toEqual('ok');
      },
    });

    const req = httpController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');

    req.flush(mock);
  });

  it('should verify cache', () => {
    const apiKey = env.get('APP_API_KEY')!;
    const testUrl = env.get('APP_API_URL')!;
    const expectedUrl = `${testUrl}?apiKey=${apiKey}`;

    const mock = {
      articles: [],
      status: 'ok',
      totalResults: 0,
    };

    http.get(expectedUrl).subscribe({
      next: res => {
        expect((res as typeof mock).status).toEqual('ok');
      },
    });

    http.get(expectedUrl).subscribe({
      next: res => {
        expect((res as typeof mock).status).toEqual('ok');
      },
    });

    const req = httpController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');

    req.flush(mock);
  });

  it('should return undefined when cache is expired', fakeAsync(() => {
    const apiKey = env.get('APP_API_KEY')!;
    const testUrl = env.get('APP_API_URL')!;
    const expectedUrl = `${testUrl}?apiKey=${apiKey}`;

    const mock = {
      articles: [],
      status: 'ok',
      totalResults: 0,
    };

    let firstResponse: unknown;
    let secondResponse: unknown;

    http.get(expectedUrl).subscribe(res => {
      firstResponse = res;
    });

    const req1 = httpController.expectOne(expectedUrl);
    expect(req1.request.method).toBe('GET');
    req1.flush(mock);

    expect((firstResponse as typeof mock).status).toEqual('ok');

    // Simulate delay of 3.5 seconds
    tick(3500);

    http.get(expectedUrl).subscribe(res => {
      secondResponse = res;
    });

    const req2 = httpController.expectOne(expectedUrl);
    expect(req2.request.method).toBe('GET');
    req2.flush(mock);

    expect((secondResponse as typeof mock).status).toEqual('ok');
  }));

  it('should NOT cache', () => {
    const apiKey = env.get('APP_API_KEY')!;
    const testUrl = env.get('APP_API_URL')!;
    const expectedUrl = `${testUrl}?apiKey=${apiKey}`;

    const mock = {
      articles: [],
      status: 'ok',
      totalResults: 0,
    };

    http.post(expectedUrl, {}).subscribe({
      next: res => {
        expect((res as typeof mock).status).toEqual('ok');
      },
    });

    const req = httpController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('POST');

    req.flush(mock);
  });
});
