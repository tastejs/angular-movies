declare const ngDevMode: boolean;

export function waitForElementTiming(
  identifiers: string[],
  config: {
    timeout: number;
  } = { timeout: 5000 }
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const { timeout } = config;
    const timeoutId = setTimeout(() => {
      if (ngDevMode)
        console.log(`waitForElementTiming timed out after ${timeout}ms`);
      resolve();
    }, timeout);
    try {
      const performanceObserver = new PerformanceObserver((l) => {
        if (identifiers.length > 0 && l.getEntries().length) {
          const observedIdentifiers = l
            .getEntries()
            .map((entry) => (entry as any).identifier as string)
            .filter((i) => identifiers.includes(i));
          if (ngDevMode && observedIdentifiers.length)
            console.log('Observed Elements: ', observedIdentifiers);
          // remove found identifiers
          identifiers = identifiers.filter(
            (i) => !observedIdentifiers.includes(i)
          );
          // If all identifiers are found
          if (identifiers.length === 0) {
            if (ngDevMode) console.log('All elements observed');
            // cleanup
            clearTimeout(timeoutId);
            performanceObserver.disconnect();
            resolve();
          }
        }
      });
      // performanceObserver.observe({type: 'largest-contentful-paint', buffered: true});
      performanceObserver.observe({ type: 'element', buffered: true });
    } catch (e) {
      console.log('waitForElementTiming failed');
      reject(e);
    }
  });
}
