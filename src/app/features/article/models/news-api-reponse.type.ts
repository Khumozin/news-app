export type NewsApiResponse<T = string> =
  | { status: 'ok'; totalResults: number; articles: T }
  | { status: 'error'; code: number; message: T };
