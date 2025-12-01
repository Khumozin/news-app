import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchParam, NewsApiResponse, Article } from '../articles.model';
import { CONFIG } from '../../../../core/config/config';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(CONFIG);
  private readonly url = this.config.get('APP_API_URL');

  getArticles(
    searchParams: SearchParam,
  ): Observable<NewsApiResponse<Article[]>> {
    const params = new HttpParams({ fromObject: { ...searchParams } });

    return this.http.get<NewsApiResponse<Article[]>>(this.url!, { params });
  }
}
