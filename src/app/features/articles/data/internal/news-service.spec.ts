import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { NewsService } from './news-service';
import { CONFIG } from '../../../../core/config/config';
import { NewsApiResponse, Article, SearchParam } from '../articles.model';

describe('NewsService', () => {
  let service: NewsService;
  let httpMock: HttpTestingController;
  const mockApiUrl = 'https://api.example.com/articles';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: CONFIG,
          useValue: {
            get: (key: string) => key === 'APP_API_URL' ? mockApiUrl : null,
          },
        },
      ],
    });
    service = TestBed.inject(NewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an observable of articles when getArticles is called', () => {
    const mockSearchParams: SearchParam = {
      q: 'technology',
      from: '2025-01-01',
      sortBy: 'publishedAt',
      pageSize: 10,
      page: 1,
    };
    const mockResponse: NewsApiResponse<Article[]> = {
      status: 'ok',
      totalResults: 1,
      articles: [
        {
          source: { id: '1', name: 'Test Source' },
          author: 'Test Author',
          title: 'Test Article',
          description: 'Test Description',
          url: 'https://example.com/article',
          urlToImage: 'https://example.com/image.jpg',
          publishedAt: '2025-01-01T00:00:00Z',
          content: 'Test Content',
        },
      ],
    };

    service.getArticles(mockSearchParams).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      if (response.status === 'ok') {
        expect(response.articles.length).toBe(1);
        expect(response.articles[0].title).toBe('Test Article');
      }
    });

    const req = httpMock.expectOne((request) => {
      return request.url === mockApiUrl && request.params.get('q') === 'technology';
    });

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
