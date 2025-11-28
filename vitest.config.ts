// CRITICAL: Load Angular compiler FIRST before anything else
import '@angular/compiler';

import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    reporters: ['default'],
    isolate: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test-setup.ts',
        '**/*.spec.ts',
        '**/*.config.ts',
        '**/main.ts',
        '**/environments/**',
      ],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      'src/': fileURLToPath(new URL('./src/', import.meta.url)),
      '@spartan-ng/helm/menu': fileURLToPath(
        new URL('./libs/ui/menu/src/index.ts', import.meta.url)
      ),
      '@spartan-ng/helm/button': fileURLToPath(
        new URL('./libs/ui/button/src/index.ts', import.meta.url)
      ),
      '@spartan-ng/helm/calendar': fileURLToPath(
        new URL('./libs/ui/calendar/src/index.ts', import.meta.url)
      ),
      '@spartan-ng/helm/date-picker': fileURLToPath(
        new URL('./libs/ui/date-picker/src/index.ts', import.meta.url)
      ),
      '@spartan-ng/helm/form-field': fileURLToPath(
        new URL('./libs/ui/form-field/src/index.ts', import.meta.url)
      ),
      '@spartan-ng/helm/icon': fileURLToPath(
        new URL('./libs/ui/icon/src/index.ts', import.meta.url)
      ),
      '@spartan-ng/helm/input': fileURLToPath(
        new URL('./libs/ui/input/src/index.ts', import.meta.url)
      ),
      '@spartan-ng/helm/pagination': fileURLToPath(
        new URL('./libs/ui/pagination/src/index.ts', import.meta.url)
      ),
      '@spartan-ng/helm/popover': fileURLToPath(
        new URL('./libs/ui/popover/src/index.ts', import.meta.url)
      ),
      '@spartan-ng/helm/select': fileURLToPath(
        new URL('./libs/ui/select/src/index.ts', import.meta.url)
      ),
      '@spartan-ng/helm/skeleton': fileURLToPath(
        new URL('./libs/ui/skeleton/src/index.ts', import.meta.url)
      ),
      '@spartan-ng/helm/sonner': fileURLToPath(
        new URL('./libs/ui/sonner/src/index.ts', import.meta.url)
      ),
      '@spartan-ng/helm/utils': fileURLToPath(
        new URL('./libs/ui/utils/src/index.ts', import.meta.url)
      ),
      '@spartan-ng/helm/dropdown-menu': fileURLToPath(
        new URL('./libs/ui/dropdown-menu/src/index.ts', import.meta.url)
      ),
    },
  },
  define: {
    'import.meta.vitest': false,
  },
});
