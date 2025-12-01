import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { toast } from 'ngx-sonner';
import { vi } from 'vitest';

import Articles from './articles';
import { CONFIG } from '../../core/config/config';
import { NewsApiResponse, Article } from './data/articles.model';

describe('Articles', () => {
  let component: Articles;
  let fixture: ComponentFixture<Articles>;
  let httpMock: HttpTestingController;
  const mockApiUrl = 'https://api.example.com/articles';

  beforeEach(async () => {
    // Mock window.matchMedia for ngx-sonner
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Mock ResizeObserver for Spartan UI components
    (
      window as Window & typeof globalThis & { ResizeObserver: unknown }
    ).ResizeObserver = class ResizeObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    };

    await TestBed.configureTestingModule({
      imports: [Articles],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: CONFIG,
          useValue: {
            get: (key: string) => {
              if (key === 'APP_API_URL') return mockApiUrl;
              if (key === 'APP_API_KEY') return 'test-api-key';
              return null;
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Articles);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open snackbar when openSnackBar is called', () => {
    const toastSpy = vi.spyOn(toast, 'error');
    const message = 'Test error message';

    component.openSnackBar(message);

    expect(toastSpy).toHaveBeenCalledWith(message, {
      description: 'Please check your request and try again',
      duration: 5000,
    });
  });

  it('should build query when buildQuery is called', () => {
    component.form.setValue({
      q: 'test query',
      from: '2025-01-01',
      sortBy: 'publishedAt',
    });
    component.currentPage.set(2);
    component.itemsPerPage.set(20);

    const query = component.buildQuery();

    expect(query).toEqual({
      q: 'test%20query',
      from: '2025-01-01',
      sortBy: 'publishedAt',
      pageSize: 20,
      page: 2,
    });
  });

  it('should get articles when getArticles is called', () => {
    const mockArticles: Article[] = [
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
    ];

    const mockResponse: NewsApiResponse<Article[]> = {
      status: 'ok',
      totalResults: 1,
      articles: mockArticles,
    };

    const query = {
      q: 'test',
      from: '2025-01-01',
      sortBy: 'publishedAt' as const,
      pageSize: 10,
      page: 1,
    };

    component.getArticles(query);

    const req = httpMock.expectOne((request) => request.url === mockApiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(component.articles()).toEqual(mockArticles);
    expect(component.totalItems()).toBe(1);
    expect(component.isLoading()).toBe(false);
  });

  it('should throw HttpErrorResponse when getArticles is called', () => {
    const mockErrorResponse: NewsApiResponse<string> = {
      status: 'error',
      code: 400,
      message: 'Bad Request',
    };

    const toastSpy = vi.spyOn(component, 'openSnackBar');

    const query = {
      q: 'test',
      from: '2025-01-01',
      sortBy: 'publishedAt' as const,
      pageSize: 10,
      page: 1,
    };

    component.getArticles(query);

    const req = httpMock.expectOne((request) => request.url === mockApiUrl);
    req.flush(mockErrorResponse, { status: 400, statusText: 'Bad Request' });

    expect(toastSpy).toHaveBeenCalledWith('Bad Request');
    expect(component.isLoading()).toBe(false);
  });

  it('should get articles when onSearch is called', () => {
    const mockArticles: Article[] = [
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
    ];

    const mockResponse: NewsApiResponse<Article[]> = {
      status: 'ok',
      totalResults: 1,
      articles: mockArticles,
    };

    component.form.setValue({
      q: 'test',
      from: '2025-01-01',
      sortBy: 'publishedAt',
    });

    component.onSearch();

    const req = httpMock.expectOne((request) => request.url === mockApiUrl);
    req.flush(mockResponse);

    expect(component.currentPage()).toBe(1);
    expect(component.articles()).toEqual(mockArticles);
  });

  it('should mark form as touched and not call getArticles when form is invalid', () => {
    const markAllAsTouchedSpy = vi.spyOn(component.form, 'markAllAsTouched');

    component.form.setValue({
      q: '',
      from: '',
      sortBy: 'publishedAt',
    });

    component.onSearch();

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    httpMock.expectNone(mockApiUrl);
  });
});
