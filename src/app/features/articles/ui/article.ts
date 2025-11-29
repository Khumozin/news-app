import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Article as IArticle } from '../data/articles.model';

@Component({
  selector: 'app-article',
  imports: [DatePipe],
  template: `
    <div
      class="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 ease-out cursor-pointer h-full"
      data-cy="article"
    >
      <!-- Image Container -->
      <div
        class="relative w-full aspect-video overflow-hidden bg-linear-to-br from-muted to-secondary"
      >
        @if (article().urlToImage && !imageError()) {
        <img
          [src]="article().urlToImage"
          [alt]="article().title"
          (error)="onImageError()"
          class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
        />
        } @else {
        <!-- Fallback Image Placeholder -->
        <div
          class="w-full h-full flex flex-col items-center justify-center gap-3 group-hover:scale-105 transition-transform duration-300 ease-out"
        >
          <svg
            class="w-16 h-16 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            ></path>
          </svg>
          <span class="text-xs font-medium text-muted-foreground"> No Image Available </span>
        </div>
        }

        <!-- Source Badge -->
        <div
          class="absolute top-3 right-3 px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm border border-border"
        >
          <p class="text-xs font-medium text-card-foreground">
            {{ article().source.name }}
          </p>
        </div>
      </div>

      <!-- Content Container -->
      <div class="flex flex-col flex-1 p-5 space-y-3">
        <!-- Title -->
        <h2
          class="text-base font-semibold text-foreground line-clamp-3 group-hover:text-muted-foreground transition-colors"
        >
          {{ article().title }}
        </h2>

        <!-- Spacer -->
        <div class="flex-1"></div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-3 border-t border-border">
          <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <time class="font-medium">
              {{ article().publishedAt | date : 'MMM d, yyyy' }}
            </time>
          </div>

          <!-- Read More Indicator -->
          <div
            class="flex items-center gap-1 text-xs font-semibold text-foreground group-hover:gap-2 transition-all"
          >
            <span>Read</span>
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Article {
  article = input.required<IArticle>();
  imageError = signal(false);

  onImageError(): void {
    this.imageError.set(true);
  }
}
