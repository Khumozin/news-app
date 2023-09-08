export interface SearchParam {
  q: string;
  from: string;
  sortBy: 'relevancy' | 'popularity' | 'publishedAt';
  pageSize: number;
  page: number;
}
