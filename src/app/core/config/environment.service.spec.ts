// Load compiler FIRST to enable JIT compilation
import '@angular/compiler';
import 'zone.js';
import 'zone.js/testing';

import { getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Initialize TestBed
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

import { describe, it, beforeEach, expect, vi } from 'vitest';

import { Environment } from './environment.interface';
import { EnvironmentService } from './environment.service';

describe('EnvironmentService', () => {
  let service: EnvironmentService;
  const mockConfig: Environment = {
    APP_API_URL: 'https://api.example.com',
    APP_API_KEY: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnvironmentService],
    });

    service = TestBed.inject(EnvironmentService);
  });

  it('should load environment config', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockConfig))
    );

    const config = await service.load();

    expect(config).toEqual(mockConfig);
    expect(service.get('APP_API_URL')).toBe(mockConfig.APP_API_URL);
  });
});
