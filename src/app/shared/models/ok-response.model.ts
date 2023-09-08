import { Article } from './article.model';

export interface NewsApiOkResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}
