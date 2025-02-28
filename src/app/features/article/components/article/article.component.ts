import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { Article } from '../../models';

@Component({
    selector: 'article',
    templateUrl: './article.component.html',
    imports: [DatePipe]
})
export class ArticleComponent {
  article = input.required<Article>();
}
