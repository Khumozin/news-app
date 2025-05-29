import { TestBed } from '@angular/core/testing';

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

  afterEach(() => {
    // Clean up the spy
    (window.fetch as jasmine.Spy).and.callThrough?.();
  });

  it('should load environment config', async () => {
    spyOn(globalThis, 'fetch').and.resolveTo(
      new Response(JSON.stringify(mockConfig))
    );

    const config = await service.load();

    expect(config).toEqual(mockConfig);
    expect(service.get('APP_API_URL')).toBe(mockConfig.APP_API_URL);
  });
});
