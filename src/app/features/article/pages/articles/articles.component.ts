import { DatePipe, DOCUMENT, TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal, ViewChild } from '@angular/core';
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
import { filter, finalize, map } from 'rxjs';

import { SkeletonDirective } from '../../../../shared/directives';
import { ArticleComponent } from '../../components';
import { SortBy } from '../../enums';
import { Article, NewsApiResponse, SearchParam } from '../../models';
import { NewsService } from '../../services';

@Component({
    selector: 'app-articles',
    templateUrl: './articles.component.html',
    styleUrls: ['./articles.component.scss'],
    providers: [DatePipe],
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        ArticleComponent,
        MatPaginatorModule,
        TitleCasePipe,
        SkeletonDirective,
        MatSnackBarModule,
        MatNativeDateModule,
        DatePipe,
    ]
})
export class ArticlesComponent {
  private readonly newsService = inject(NewsService);
  private readonly datePipe = inject(DatePipe);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(MatSnackBar);
  private readonly document = inject(DOCUMENT);

  protected readonly pageSizeOptions = [5, 10, 25];

  protected readonly sortByOptions = Object.keys(SortBy).filter((item) =>
    isNaN(Number.parseInt(item))
  );

  articles = signal<Article[]>([]);
  isLoading = signal(false);
  totalItems = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);

  form = new FormGroup({
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

    this.document.defaultView?.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
  }

  buildQuery(): SearchParam {
    const { q, from, sortBy } = this.form.value;

    return {
      q: encodeURI(q!),
      from: this.datePipe.transform(from, 'yyyy-MM-dd'),
      sortBy,
      pageSize: this.paginator.pageSize,
      page: this.paginator.pageIndex + 1,
    } as SearchParam;
  }

  getArticles(query: SearchParam): void {
    this.isLoading.set(true);

    this.newsService
      .getArticles(query)
      .pipe(
        filter((response) => response.status === 'ok'),
        map((response) => {
          this.totalItems.set(response.totalResults);

          return response.articles;
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (results) => {
          this.articles.set(results);
        },
        error: (e) => {
          const error = e.error as NewsApiResponse;

          if (error.status === 'error') {
            this.openSnackBar(error.message);
          }
        },
      });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 5000,
    });
  }
}
