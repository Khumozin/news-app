import { DatePipe, TitleCasePipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
  DOCUMENT,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { filter, finalize, map } from 'rxjs';
import { toast } from 'ngx-sonner';

import { ArticleComponent } from '../../components';
import { SortBy } from '../../enums';
import { Article, NewsApiResponse, SearchParam } from '../../models';
import { NewsService } from '../../services';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmNumberedPaginationQueryParams } from '@spartan-ng/helm/pagination';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  providers: [DatePipe],
  imports: [
    ReactiveFormsModule,
    ArticleComponent,
    TitleCasePipe,
    MatNativeDateModule,

    HlmButtonImports,
    HlmInputImports,
    HlmDatePickerImports,
    BrnSelectImports,
    HlmSelectImports,
    HlmNumberedPaginationQueryParams,
    HlmToasterImports,
    HlmSkeletonImports,
  ],
})
export class ArticlesComponent {
  private readonly newsService = inject(NewsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly route = inject(ActivatedRoute);

  protected readonly pageSizeOptions = [5, 10, 25, 50];

  protected readonly sortByOptions = Object.keys(SortBy).filter(item =>
    isNaN(Number.parseInt(item))
  );

  articles = signal<Article[]>([]);
  isLoading = signal(false);
  totalItems = signal(0);

  // Pagination signals that work with Spartan pagination
  currentPage = signal(1);
  itemsPerPage = signal(10);

  form = new FormGroup({
    q: new FormControl<string>('', [Validators.required]),
    from: new FormControl<string>('', [Validators.required]),
    sortBy: new FormControl<keyof typeof SortBy>('relevancy'),
  });

  constructor() {
    // Sync pagination with query params - refetch data when page/size changes
    effect(() => {
      this.currentPage();
      this.itemsPerPage();

      // When pagination changes, fetch new data (but not on initial load)
      if (this.form.valid && this.articles().length > 0) {
        const query = this.buildQuery();
        this.getArticles(query);

        // Scroll to top on page change
        this.document.defaultView?.scrollTo({
          behavior: 'smooth',
          top: 0,
        });
      }
    });

    // Read initial query params
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const page = Number(params['page']) || 1;
        const pageSize = Number(params['pageSize']) || 10;

        if (page !== this.currentPage()) {
          this.currentPage.set(page);
        }
        if (pageSize !== this.itemsPerPage()) {
          this.itemsPerPage.set(pageSize);
        }
      });
  }

  onSearch(): void {
    if (this.form.invalid) {
      return this.form.markAllAsTouched();
    }

    // Reset to page 1 when searching
    this.currentPage.set(1);
    const query = this.buildQuery();
    this.getArticles(query);
  }

  buildQuery(): SearchParam {
    const { q, from, sortBy } = this.form.value;

    return {
      q: encodeURI(q!),
      from: new Date(from!).toISOString().split('T')[0],
      sortBy,
      pageSize: this.itemsPerPage(),
      page: this.currentPage(),
    } as SearchParam;
  }

  getArticles(query: SearchParam): void {
    this.isLoading.set(true);

    this.newsService
      .getArticles(query)
      .pipe(
        filter(response => response.status === 'ok'),
        map(response => {
          this.totalItems.set(response.totalResults);

          return response.articles;
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: results => {
          this.articles.set(results);
        },
        error: e => {
          const error = e.error as NewsApiResponse;

          if (error.status === 'error') {
            this.openSnackBar(error.message);
          }
        },
      });
  }

  openSnackBar(message: string) {
    toast.error(message, {
      description: 'Please check your request and try again',
      duration: 5000,
    });
  }
}
