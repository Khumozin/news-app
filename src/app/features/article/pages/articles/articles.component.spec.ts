// Load compiler FIRST to enable JIT compilation
import '@angular/compiler';
import 'zone.js';
import 'zone.js/testing';

// Mock window.matchMedia for ngx-sonner compatibility
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock ResizeObserver for @spartan-ng/brain components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

import { DatePipe } from '@angular/common';
import {
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DestroyRef } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Initialize TestBed
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { provideEnvironmentConfig } from 'src/app/core/config/environment.provider';
import { Article, NewsApiResponse } from 'src/app/features/article/models';
import { NewsService } from 'src/app/features/article/services';

import { ArticlesComponent } from './articles.component';

describe('ArticlesComponent', () => {
  let component: ArticlesComponent;
  let fixture: ComponentFixture<ArticlesComponent>;

  let newsService: NewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ArticlesComponent],
      providers: [
        NewsService,
        DatePipe,
        DestroyRef,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideEnvironmentConfig(),
        provideRouter([]),
      ],
    });
    fixture = TestBed.createComponent(ArticlesComponent);
    component = fixture.componentInstance;

    newsService = TestBed.inject(NewsService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open snackbar when openSnackBar is called', () => {
    const spyOnOpenSnackBar = vi.spyOn(component, 'openSnackBar');

    component.openSnackBar('Hello');

    expect(spyOnOpenSnackBar).toHaveBeenCalled();
  });

  it('should build query when buildQuery is called', () => {
    component.form.setValue({
      from: '2023-09-08',
      q: 'Bitcoin',
      sortBy: 'relevancy',
    });

    component.itemsPerPage.set(10);
    component.currentPage.set(1);

    const query = component.buildQuery();

    expect(query).toBeTruthy();
  });

  it('should get articles when getArticles is called', () => {
    const okResponse: NewsApiResponse<Article[]> = {
      articles: [],
      status: 'ok',
      totalResults: 0,
    };

    component.form.setValue({
      from: '2023-09-08',
      q: 'Bitcoin',
      sortBy: 'relevancy',
    });

    component.itemsPerPage.set(10);
    component.currentPage.set(1);

    const query = component.buildQuery();

    vi.spyOn(newsService, 'getArticles').mockReturnValue(of(okResponse));

    component.getArticles(query);

    expect(component.articles()).toEqual(okResponse.articles);
  });

  it('should throw HttpErrorResponse when getArticles is called', () => {
    const spyOnOpenSnackBar = vi.spyOn(component, 'openSnackBar');

    component.form.setValue({
      from: '2023-09-08',
      q: 'Bitcoin',
      sortBy: 'relevancy',
    });

    component.itemsPerPage.set(10);
    component.currentPage.set(1);

    const query = component.buildQuery();

    vi.spyOn(newsService, 'getArticles').mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: {
              code: 400,
              message: 'Failed',
              status: 'error',
            } satisfies NewsApiResponse,
          })
      )
    );

    component.getArticles(query);

    expect(spyOnOpenSnackBar).toHaveBeenCalled();
  });

  it('should get articles when onSearch is called', () => {
    const okResponse: NewsApiResponse<Article[]> = {
      articles: [],
      status: 'ok',
      totalResults: 0,
    };

    component.form.setValue({
      from: '2023-09-08',
      q: 'Bitcoin',
      sortBy: 'relevancy',
    });

    component.itemsPerPage.set(10);
    component.currentPage.set(1);

    vi.spyOn(newsService, 'getArticles').mockReturnValue(of(okResponse));

    component.onSearch();

    expect(component.articles()).toEqual(okResponse.articles);
  });

  it('should mark form as touched and not call getArticles when form is invalid', () => {
    vi.spyOn(component.form, 'markAllAsTouched');
    vi.spyOn(component, 'getArticles');

    component.onSearch();

    expect(component.form.markAllAsTouched).toHaveBeenCalled();
    expect(component.getArticles).not.toHaveBeenCalled();
  });
});
