import { DatePipe } from '@angular/common';
import {
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DestroyRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
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
    const spyOnOpenSnackBar = spyOn(component, 'openSnackBar');

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

    spyOn(newsService, 'getArticles').and.returnValues(of(okResponse));

    component.getArticles(query);

    expect(component.articles()).toEqual(okResponse.articles);
  });

  it('should throw HttpErrorResponse when getArticles is called', () => {
    const spyOnOpenSnackBar = spyOn(component, 'openSnackBar');

    component.form.setValue({
      from: '2023-09-08',
      q: 'Bitcoin',
      sortBy: 'relevancy',
    });

    component.itemsPerPage.set(10);
    component.currentPage.set(1);

    const query = component.buildQuery();

    spyOn(newsService, 'getArticles').and.returnValues(
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

    spyOn(newsService, 'getArticles').and.returnValues(of(okResponse));

    component.onSearch();

    expect(component.articles()).toEqual(okResponse.articles);
  });

  it('should mark form as touched and not call getArticles when form is invalid', () => {
    spyOn(component.form, 'markAllAsTouched');
    spyOn(component, 'getArticles');

    component.onSearch();

    expect(component.form.markAllAsTouched).toHaveBeenCalled();
    expect(component.getArticles).not.toHaveBeenCalled();
  });
});
