import { Component, Input } from '@angular/core';

import { Article } from '../../../../shared/models';

@Component({
  selector: 'article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {
  @Input() article: Article | undefined = undefined;
}
