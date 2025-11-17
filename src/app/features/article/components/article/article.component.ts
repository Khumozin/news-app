import { DatePipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';

import { Article } from '../../models';

@Component({
  selector: 'article',
  templateUrl: './article.component.html',
  imports: [DatePipe],
})
export class ArticleComponent {
  article = input.required<Article>();
  imageError = signal(false);

  onImageError(): void {
    this.imageError.set(true);
  }
}
