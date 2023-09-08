import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { finalize } from 'rxjs';
import { NewsApiOkResponse, SearchParam } from 'src/app/shared/models';
import { environment } from 'src/environments/environment.development';

import { NewsService } from './news.service';

describe('NewsService', () => {
  let service: NewsService;
  let httpController: HttpTestingController;
  let url = environment.newApiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(NewsService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an observable of articles when getArticles is called', (done) => {
    const mock: NewsApiOkResponse = {
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
        next: (res) => expect(res.status).toEqual('ok'),
      });

    const req = httpController.expectOne(
      `https://newsapi.org/v2/everything?from=2023-09-08&q=Bitcoin&sortBy=relevancy&page=1&pageSize=10`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(mock);

    expect(req.request.params).toBeTruthy();
  });
});
