import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, of } from 'rxjs';

import { NewsService } from '../../../../core/services';
import { Article, NewsApiErrorResponse, SearchParam } from '../../../../shared/models';
import { SortBy } from '../../enums';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  providers: [DatePipe],
})
export class ArticlesComponent {
  private readonly newsService = inject(NewsService);
  private readonly datePipe = inject(DatePipe);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(MatSnackBar);
  public articles: Array<Article> = [];
  public totalItems = 0;
  public pageSize = 10;
  public pageIndex = 0;
  public pageSizeOptions = [5, 10, 25];
  public sortByOptions = Object.keys(SortBy).filter((item) =>
    isNaN(Number.parseInt(item))
  );

  public form = new FormGroup({
    q: new FormControl<string>('', [Validators.required]),
    from: new FormControl<string>('', [Validators.required]),
    sortBy: new FormControl<keyof typeof SortBy>('relevancy'),
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onSearch(): void {
    const query = this.buildQuery();
    this.getArticles(query);
  }

  handlePageEvent() {
    const query = this.buildQuery();
    this.getArticles(query);

    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
  }

  buildQuery(): SearchParam {
    const { q, from, sortBy } = this.form.value;

    return {
      q: encodeURI(q as string),
      from: this.datePipe.transform(from, 'yyyy-MM-dd') as string,
      sortBy,
      pageSize: this.paginator.pageSize,
      page: this.paginator.pageIndex + 1,
    } as SearchParam;
  }

  getArticles(query: SearchParam): void {
    this.newsService
      .getArticles(query)
      .pipe(
        map((response) => {
          this.totalItems = response.totalResults;

          return response.articles;
        }),
        takeUntilDestroyed(this.destroyRef),
        catchError((e) => of(e))
      )
      .subscribe({
        next: (results) => {
          if (results instanceof HttpErrorResponse) {
            this.openSnackBar((results.error as NewsApiErrorResponse).message);
            return;
          }

          this.articles = results;
        },
      });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 5000,
    });
  }
}
