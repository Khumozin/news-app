import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'app-theme';

  public readonly theme = signal<Theme>(this.getStoredTheme());

  constructor() {
    // Apply theme on initialization
    effect(() => {
      const theme = this.theme();
      this.applyTheme(theme);
      localStorage.setItem(this.THEME_STORAGE_KEY, theme);
    });

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.theme() === 'system') {
          this.applyTheme('system');
        }
      });
    }
  }

  public setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(this.THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return 'system';
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }
}
