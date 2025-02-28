import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import { Article, NewsApiResponse, SearchParam } from '../models';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private readonly url = environment.newApiUrl;
  private readonly http = inject(HttpClient);

  getArticles(
    searchParams: SearchParam
  ): Observable<NewsApiResponse<Article[]>> {
    const params = new HttpParams({ fromObject: { ...searchParams } });

    return this.http.get<NewsApiResponse<Article[]>>(this.url, { params });
  }
}
