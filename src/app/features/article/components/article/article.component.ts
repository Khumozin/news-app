import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { Article } from '../../models';

@Component({
  selector: 'article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  standalone: true,
  imports: [DatePipe],
})
export class ArticleComponent {
  article = input<Article>();
}
