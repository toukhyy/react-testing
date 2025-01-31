import { delay, http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

/**
 * Simulate API Delay function for tests.
 *
 * @param {string} endpoint - the endpoint to be tested. Must be prefixed with a slash.
 *
 * @example
 * simulateAPIDelay('/products');
 */
export function simulateAPIDelay(endpoint: string) {
  server.use(
    http.get(endpoint, async () => {
      await delay();
      return HttpResponse.json([]);
    })
  );
}

/**
 * Simulate API Error function for tests.
 *
 * @param {string} endpoint - the endpoint to be tested. Must be prefixed with a slash.
 *
 * @example
 * simulateAPIError('/products');
 */
export function simulateAPIError(endpoint: string) {
  server.use(
    http.get(endpoint, () => {
      return HttpResponse.error();
    })
  );
}
