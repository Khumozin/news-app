import { DatePipe, TitleCasePipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  signal,
  DOCUMENT,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, finalize, map } from 'rxjs';
import { toast } from 'ngx-sonner';

import { Article } from './ui/article';
import { SortBy } from './enums/sort-by.enum';
import {
  Article as IArticle,
  NewsApiResponse,
  SearchParam,
} from './data/articles.model';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmNumberedPaginationQueryParams } from '@spartan-ng/helm/pagination';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { NewsService } from './data/internal/news-service';

@Component({
  selector: 'app-articles',
  imports: [
    ReactiveFormsModule,
    Article,
    TitleCasePipe,

    HlmButtonImports,
    HlmInputImports,
    HlmDatePickerImports,
    BrnSelectImports,
    HlmSelectImports,
    HlmNumberedPaginationQueryParams,
    HlmToasterImports,
    HlmSkeletonImports,
  ],
  providers: [DatePipe],
  template: `
    <hlm-toaster />

    <div class="w-full flex justify-center px-4 py-8">
      <div class="w-full max-w-4xl">
        <div class="bg-card rounded-2xl shadow-lg border border-border p-8">
          <h2 class="text-2xl font-bold text-foreground mb-6 text-center">
            Search News Articles
          </h2>

          <form [formGroup]="form" class="space-y-6">
            <!-- Search Input -->
            <div class="space-y-2">
              <div class="text-sm font-medium text-muted-foreground">
                Search Query
              </div>
              <input
                class="w-full"
                hlmInput
                data-cy="form-input-query"
                placeholder="Enter keywords to search..."
                formControlName="q"
              />
            </div>

            <!-- Date and Sort Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Date Picker -->
              <div class="space-y-2">
                <div class="text-sm font-medium text-muted-foreground">
                  From Date
                </div>
                <hlm-date-picker
                  formControlName="from"
                  [autoCloseOnSelect]="true"
                  data-cy="form-input-date"
                  class="w-full"
                >
                  <span>Pick a date</span>
                </hlm-date-picker>
              </div>

              <!-- Sort By -->
              <div class="space-y-2">
                <div class="text-sm font-medium text-muted-foreground">
                  Sort By
                </div>
                <brn-select
                  class="w-full"
                  placeholder="Select sorting option"
                  formControlName="sortBy"
                  data-cy="form-input-sort"
                >
                  <hlm-select-trigger class="w-full">
                    <hlm-select-value />
                  </hlm-select-trigger>
                  <hlm-select-content>
                    @for (sortByOption of sortByOptions; track $index) {
                      <hlm-option [value]="sortByOption">
                        {{ sortByOption | titlecase }}
                      </hlm-option>
                    }
                  </hlm-select-content>
                </brn-select>
              </div>
            </div>

            <!-- Search Button -->
            <div class="flex justify-center pt-2">
              <button
                hlmBtn
                (click)="onSearch()"
                data-cy="form-submit-button"
                class="w-full md:w-auto px-12 py-6 text-base font-semibold"
              >
                Search Articles
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="w-full flex md:px-16 lg:px-24">
      <div
        class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-5 px-4"
      >
        @if (isLoading()) {
          @for (_ of [1, 2, 3, 4, 5, 6]; track $index) {
            <!-- Skeleton Card -->
            <div
              class="flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm h-full"
            >
              <!-- Skeleton Image -->
              <hlm-skeleton class="w-full aspect-video rounded-none" />

              <!-- Skeleton Content -->
              <div class="flex flex-col flex-1 p-5 space-y-3">
                <!-- Skeleton Title Lines -->
                <div class="space-y-2">
                  <hlm-skeleton class="h-4 w-full" />
                  <hlm-skeleton class="h-4 w-4/5" />
                  <hlm-skeleton class="h-4 w-3/4" />
                </div>

                <!-- Spacer -->
                <div class="flex-1"></div>

                <!-- Skeleton Footer -->
                <div
                  class="flex items-center justify-between pt-3 border-t border-border"
                >
                  <hlm-skeleton class="h-3 w-24" />
                  <hlm-skeleton class="h-3 w-16" />
                </div>
              </div>
            </div>
          }
        } @else {
          @for (article of articles(); track $index) {
            <app-article [article]="article" />
          }
        }
      </div>
    </div>

    <div class="w-full flex items-center justify-center mt-8">
      <hlm-numbered-pagination-query-params
        [(currentPage)]="currentPage"
        [(itemsPerPage)]="itemsPerPage"
        [totalItems]="totalItems()"
        [pageSizes]="pageSizeOptions"
        [maxSize]="5"
        [showEdges]="true"
      />
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Articles {
  private readonly newsService = inject(NewsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly route = inject(ActivatedRoute);

  protected readonly pageSizeOptions = [5, 10, 25, 50];

  protected readonly sortByOptions = Object.keys(SortBy).filter((item) =>
    isNaN(Number.parseInt(item)),
  );

  articles = signal<IArticle[]>([]);
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
    // Read initial query params
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const page = Number(params['page']) || 1;
        const pageSize = Number(params['pageSize']) || 10;

        if (page !== this.currentPage()) {
          this.currentPage.set(page);
        }
        if (pageSize !== this.itemsPerPage()) {
          this.itemsPerPage.set(pageSize);
        }

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
        filter((response) => response.status === 'ok'),
        map((response) => {
          this.totalItems.set(response.totalResults);

          return response.articles;
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
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
    toast.error(message, {
      description: 'Please check your request and try again',
      duration: 5000,
    });
  }
}
