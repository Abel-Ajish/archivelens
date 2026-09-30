const circuitBreakers = new Map<
  string,
  { failures: number; lastFailure: number; open: boolean }
>();

const FAILURE_THRESHOLD = 3;
const RESET_TIMEOUT = 60_000;

export class CircuitBreakerOpenError extends Error {
  constructor(providerId: string) {
    super(`Circuit breaker open for ${providerId}`);
    this.name = "CircuitBreakerOpenError";
  }
}

export function checkCircuitBreaker(providerId: string): void {
  const cb = circuitBreakers.get(providerId);
  if (!cb) return;
  if (cb.open && Date.now() - cb.lastFailure > RESET_TIMEOUT) {
    cb.open = false;
    cb.failures = 0;
    return;
  }
  if (cb.open) {
    throw new CircuitBreakerOpenError(providerId);
  }
}

export function recordSuccess(providerId: string): void {
  circuitBreakers.delete(providerId);
}

export function recordFailure(providerId: string): void {
  const cb = circuitBreakers.get(providerId) ?? {
    failures: 0,
    lastFailure: 0,
    open: false,
  };
  cb.failures += 1;
  cb.lastFailure = Date.now();
  if (cb.failures >= FAILURE_THRESHOLD) {
    cb.open = true;
  }
  circuitBreakers.set(providerId, cb);
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  providerId: string,
  maxRetries = 2,
): Promise<T> {
  checkCircuitBreaker(providerId);
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      recordSuccess(providerId);
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      recordFailure(providerId);
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * 2 ** attempt, 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}
