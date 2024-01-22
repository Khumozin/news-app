export interface NewsApiOkResponse<T> {
  status: string;
  totalResults: number;
  articles: T[];
}
