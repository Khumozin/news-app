import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { networkInterceptor } from './network-interceptor';
import { CONFIG } from '../config/config';

describe('networkInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => networkInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CONFIG,
          useValue: {
            get: (key: string) => (key === 'APP_API_KEY' ? 'test-api-key-123' : null),
          },
        },
      ],
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add the API key as a query parameter', () => {
    const mockRequest = new HttpRequest('GET', 'https://api.example.com/test');
    const mockNext = (req: HttpRequest<unknown>) => {
      expect(req.params.get('apiKey')).toBe('test-api-key-123');
      return of(new HttpResponse({ status: 200 }));
    };

    interceptor(mockRequest, mockNext);
  });
});

describe('NetworkInterceptor Negative Tests', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => networkInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CONFIG,
          useValue: {
            get: () => null,
          },
        },
      ],
    });
  });

  it('should NOT add the API key as a query parameter', () => {
    const mockRequest = new HttpRequest('GET', 'https://api.example.com/test');
    const mockNext = (req: HttpRequest<unknown>) => {
      expect(req.params.get('apiKey')).toBeNull();
      return of(new HttpResponse({ status: 200 }));
    };

    interceptor(mockRequest, mockNext);
  });
});
