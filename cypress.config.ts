import { defineConfig } from 'cypress';

export default defineConfig({
  retries: {
    runMode: 2,
    openMode: 0
  },
  e2e: {
    baseUrl: 'http://localhost:4000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
});
