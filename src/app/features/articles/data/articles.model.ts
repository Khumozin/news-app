export interface Source {
  id?: string;
  name: string;
}

export interface Article {
  source: Source;
  author?: string;
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  content: string;
}

export interface SearchParam {
  q: string;
  from: string;
  sortBy: 'relevancy' | 'popularity' | 'publishedAt';
  pageSize: number;
  page: number;
}

export type NewsApiResponse<T = string> =
  | { status: 'ok'; totalResults: number; articles: T }
  | { status: 'error'; code: number; message: T };
