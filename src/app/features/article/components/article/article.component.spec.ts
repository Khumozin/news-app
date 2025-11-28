// Load compiler FIRST to enable JIT compilation
import '@angular/compiler';
import 'zone.js';
import 'zone.js/testing';

import { ComponentRef } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Initialize TestBed
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

import { describe, it, beforeEach, expect } from 'vitest';

import { ArticleMock } from '../../mock';
import { ArticleComponent } from './article.component';

const mock = new ArticleMock()
  .withSource({ name: 'Source', id: '1' })
  .withAuthor('Author')
  .withTitle('Title')
  .withDescription('Description')
  .withUrl('url.test')
  .withUrlToImage('')
  .withPublishedAt('')
  .withContent('')
  .model();

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let componentRef: ComponentRef<ArticleComponent>;
  let fixture: ComponentFixture<ArticleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ArticleComponent],
    });
    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('article', mock);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an article object', () => {
    expect(component.article()).toEqual(mock);
  });
});
