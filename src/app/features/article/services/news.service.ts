import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ENVIRONMENT } from '../../../core/config/environment.token';
import { Article, NewsApiResponse, SearchParam } from '../models';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(ENVIRONMENT);
  private readonly url = this.env.get('APP_API_URL');

  getArticles(
    searchParams: SearchParam
  ): Observable<NewsApiResponse<Article[]>> {
    const params = new HttpParams({ fromObject: { ...searchParams } });

    return this.http.get<NewsApiResponse<Article[]>>(this.url!, { params });
  }
}
