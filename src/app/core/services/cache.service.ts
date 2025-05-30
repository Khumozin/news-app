import { HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface CacheEntry {
  value: HttpEvent<unknown>;
  expiresOn: number;
}

const TTL = 3_000;

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  readonly #cache = new Map<string, CacheEntry>();

  get(key: string): HttpEvent<unknown> | undefined {
    const cached = this.#cache.get(key);

    if (!cached) {
      return undefined;
    }

    const hasExpired = new Date().getTime() >= cached.expiresOn;
    if (hasExpired) {
      this.#cache.delete(key);
      return undefined;
    }

    return cached.value;
  }

  set(key: string, value: HttpEvent<unknown>): void {
    this.#cache.set(key, {
      value,
      expiresOn: new Date().getTime() + TTL,
    });
  }
}
