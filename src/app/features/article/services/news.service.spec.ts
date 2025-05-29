import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { finalize, firstValueFrom, of } from 'rxjs';
import { ENVIRONMENT } from 'src/app/core/config/environment.token';
import {
  Article,
  NewsApiResponse,
  SearchParam,
} from 'src/app/features/article/models';

import { Environment } from '../../../core/config/environment.interface';
import { EnvironmentService } from '../../../core/config/environment.service';
import { NewsService } from './news.service';

const environmentMock = {
  APP_API_URL: 'https://api.test.dev',
  APP_API_KEY: 'APIKEY',
};

describe('NewsService', () => {
  let service: NewsService;
  let httpController: HttpTestingController;
  let env: EnvironmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
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

    service = TestBed.inject(NewsService);
    httpController = TestBed.inject(HttpTestingController);
    env = TestBed.inject(ENVIRONMENT);

    env.load().then();
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an observable of articles when getArticles is called', done => {
    const mock: NewsApiResponse<Article[]> = {
      articles: [],
      status: 'ok',
      totalResults: 0,
    };

    const query: SearchParam = {
      from: '2023-09-08',
      q: 'Bitcoin',
      sortBy: 'relevancy',
      page: 1,
      pageSize: 10,
    };

    service
      .getArticles(query)
      .pipe(finalize(done))
      .subscribe({
        next: res => expect(res.status).toEqual('ok'),
      });

    const req = httpController.expectOne(
      `${env.get('APP_API_URL')!}?from=2023-09-08&q=Bitcoin&sortBy=relevancy&page=1&pageSize=10`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(mock);

    expect(req.request.params).toBeTruthy();
  });
});
