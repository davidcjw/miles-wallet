import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Pin the timezone so date/expiry math is deterministic across machines/CI.
// Set here (evaluated before workers fork) so inherited env carries UTC.
process.env.TZ = 'UTC';

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, './app') },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
