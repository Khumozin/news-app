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
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { Environment } from '../config/environment.interface';
import { EnvironmentService } from '../config/environment.service';
import { networkInterceptor } from './network.interceptor';

const environmentMock = {
  APP_API_URL: 'https://api.test.dev',
  APP_API_KEY: 'APIKEY',
};

describe('NetworkInterceptor', () => {
  let httpController: HttpTestingController;
  let http: HttpClient;
  let env: EnvironmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptors([networkInterceptor])),
        provideHttpClientTesting(),
        {
          provide: EnvironmentService,
          useValue: {
            load: () => firstValueFrom(of(environmentMock)),
            get: (key: keyof Environment) => environmentMock[key],
          },
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
    env = TestBed.inject(EnvironmentService);

    env.load().then();
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
    const apiKey = env.get('APP_API_KEY')!;
    const testUrl = env.get('APP_API_URL')!;
    const expectedUrl = `${testUrl}?apiKey=${apiKey}`;

    http.get(testUrl).subscribe();

    const req = httpController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');

    req.flush({});
  });
});
