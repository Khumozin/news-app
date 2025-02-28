import { Article } from '../models';
import { SourceMock } from './source.mock';

export class ArticleMock {
  private _data: Article = {
    source: new SourceMock().withId('').withName('').model(),
    author: '',
    title: '',
    description: '',
    url: '',
    urlToImage: '',
    publishedAt: '',
    content: '',
  };

  public withSource(source: Article['source']): ArticleMock {
    this._data.source = source;
    return this;
  }

  public withAuthor(author: Article['author']): ArticleMock {
    this._data.author = author;
    return this;
  }

  public withTitle(title: Article['title']): ArticleMock {
    this._data.title = title;
    return this;
  }

  public withDescription(description: Article['description']): ArticleMock {
    this._data.description = description;
    return this;
  }

  public withUrl(url: Article['url']): ArticleMock {
    this._data.url = url;
    return this;
  }

  public withUrlToImage(urlToImage: Article['urlToImage']): ArticleMock {
    this._data.urlToImage = urlToImage;
    return this;
  }

  public withPublishedAt(publishedAt: Article['publishedAt']): ArticleMock {
    this._data.publishedAt = publishedAt;
    return this;
  }

  public withContent(content: Article['content']): ArticleMock {
    this._data.content = content;
    return this;
  }

  public model(): Article {
    return this._data;
  }
}
