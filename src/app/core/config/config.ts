import { inject, Injectable } from '@angular/core';
import { InjectionToken } from '@angular/core';

export interface Config {
  APP_API_URL: string;
  APP_API_KEY: string;
}

export interface ConfigToken {
  load(): Promise<Config>;
  get(key: keyof Config): string | undefined;
}

export const CONFIG = new InjectionToken<ConfigToken>('App Config');

/**
 * Service for loading and managing application configuration.
 * Loads configuration from a JSON file at application startup.
 */
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  #config?: Config;

  /**
   * Loads the config configuration from the config.json file.
   * Tries to load config.local.json first (for local development with secrets).
   * Falls back to config.json (for CI/production with placeholders).
   *
   * @returns A promise that resolves to the loaded config configuration
   * @throws Error if the configuration file cannot be loaded or is invalid
   */
  async load(): Promise<Config> {
    try {
      // Try loading config.local.json first (local development)
      let res = await fetch('./config.local.json');

      // If config.local.json doesn't exist, fall back to config.json
      if (!res.ok && res.status === 404) {
        res = await fetch('./config.json');
      }

      if (!res.ok) {
        throw new Error(
          `Failed to load config: ${res.status} ${res.statusText}`,
        );
      }

      const data: unknown = await res.json();
      this.#validateConfig(data);
      this.#config = data as Config;
      return this.#config;
    } catch (error) {
      console.error('Error loading config configuration:', error);
      throw new Error(
        `Failed to load config configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Validates that the loaded configuration contains all required keys.
   *
   * @param data - The configuration data to validate
   * @throws Error if required configuration keys are missing or invalid
   */
  #validateConfig(data: unknown): void {
    if (!data || typeof data !== 'object') {
      throw new Error('Configuration must be a valid object');
    }

    const config = data as Record<string, unknown>;
    const requiredKeys: (keyof Config)[] = ['APP_API_URL', 'APP_API_KEY'];

    const missingKeys = requiredKeys.filter((key) => {
      const value = config[key];
      return value === undefined || value === null || value === '';
    });

    if (missingKeys.length > 0) {
      throw new Error(
        `Missing required configuration keys: ${missingKeys.join(', ')}`,
      );
    }

    // Validate that APP_API_URL is a non-empty string
    if (typeof config['APP_API_URL'] !== 'string') {
      throw new Error('APP_API_URL must be a string');
    }

    // Validate that APP_API_KEY is a non-empty string
    if (typeof config['APP_API_KEY'] !== 'string') {
      throw new Error('APP_API_KEY must be a string');
    }
  }

  /**
   * Retrieves a configuration value by key.
   *
   * @param key - The configuration key to retrieve
   * @returns The configuration value, or undefined if not loaded or not found
   */
  get(key: keyof Config): string | undefined {
    return this.#config?.[key];
  }
}

export function provideConfig() {
  return {
    provide: CONFIG,
    useFactory: () => inject(ConfigService),
  };
}
