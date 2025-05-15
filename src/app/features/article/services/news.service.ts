import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EnvironmentService } from '../../../core/config/environment.service';
import { Article, NewsApiResponse, SearchParam } from '../models';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(EnvironmentService);
  private readonly url = this.env.get('APP_API_URL');

  getArticles(
    searchParams: SearchParam
  ): Observable<NewsApiResponse<Article[]>> {
    const params = new HttpParams({ fromObject: { ...searchParams } });

    return this.http.get<NewsApiResponse<Article[]>>(this.url!, { params });
  }
}
