import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Article } from './article';

describe('Article', () => {
  let component: Article;
  let fixture: ComponentFixture<Article>;

  const mockArticle = {
    source: { id: '1', name: 'Test Source' },
    author: 'Test Author',
    title: 'Test Article',
    description: 'Test Description',
    url: 'https://example.com/article',
    urlToImage: 'https://example.com/image.jpg',
    publishedAt: '2025-01-01T00:00:00Z',
    content: 'Test Content',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Article],
    }).compileComponents();

    fixture = TestBed.createComponent(Article);
    fixture.componentRef.setInput('article', mockArticle);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an article object', () => {
    expect(component.article()).toEqual(mockArticle);
  });
});
