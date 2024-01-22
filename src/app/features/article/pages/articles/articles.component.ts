import { DatePipe, DOCUMENT, NgFor, TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { catchError, finalize, map, of } from 'rxjs';

import { SkeletonDirective } from '../../../../shared/directives';
import { ArticleComponent } from '../../components';
import { SortBy } from '../../enums';
import { Article, NewsApiErrorResponse, SearchParam } from '../../models';
import { NewsService } from '../../services';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  providers: [DatePipe],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    MatButtonModule,
    ArticleComponent,
    MatPaginatorModule,
    TitleCasePipe,
    SkeletonDirective,
    MatSnackBarModule,
    MatNativeDateModule,
    DatePipe,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ArticlesComponent {
  private readonly newsService = inject(NewsService);
  private readonly datePipe = inject(DatePipe);
  private readonly destroyRef = inject(DestroyRef);
  // private readonly snackBar = inject(MatSnackBar);
  private readonly doc = inject(DOCUMENT);

  articles: Array<Article> = [];
  isLoading = false;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  sortByOptions = Object.keys(SortBy).filter((item) =>
    isNaN(Number.parseInt(item))
  );

  form = new FormGroup({
    q: new FormControl<string>('', [Validators.required]),
    from: new FormControl<string>('', [Validators.required]),
    sortBy: new FormControl<keyof typeof SortBy>('relevancy'),
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private snackBar: MatSnackBar) {}

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
    this.isLoading = true;

    this.newsService
      .getArticles(query)
      .pipe(
        map((response) => {
          this.totalItems = response.totalResults;

          return response.articles;
        }),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => (this.isLoading = false)),
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
