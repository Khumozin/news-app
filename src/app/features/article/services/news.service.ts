import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import { Article, NewsApiOkResponse, SearchParam } from '../models';

function buildParams(searchParams: SearchParam) {
  let params = new HttpParams();
  const keys = Object.keys(searchParams);

  keys.forEach((param) => {
    params = params.append(param, searchParams[param as keyof SearchParam]);
  });

  return params;
}

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private readonly url = environment.newApiUrl;
  private readonly http = inject(HttpClient);

  getArticles(
    searchParams: SearchParam
  ): Observable<NewsApiOkResponse<Article>> {
    const params = buildParams(searchParams);

    return this.http.get<NewsApiOkResponse<Article>>(this.url, { params });
  }
}
