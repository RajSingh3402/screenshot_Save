import type { Page } from 'puppeteer';

/**
 * Common preloader / spinner selectors used by many sites. Centralized here so
 * the wait-and-hide logic lives in one place instead of being duplicated across
 * the capture pipeline.
 */
const LOADER_SELECTORS = [
  '#preloader',
  '.preloader',
  '#loader',
  '.loader',
  '#loading',
  '.loading',
  '.site-preloader',
  '.site-loader',
  '.page-loader',
  '#page-preloader',
  '.gt3_preloader',
  '.loading-screen',
  '.spinner-wrapper',
  '#spinner-wrapper',
  '.preloader-wrapper',
  '#preloader-wrapper',
];

/** Poll up to `maxWaitMs` for visible loader overlays to disappear. */
export async function waitForLoadersGone(page: Page, maxWaitMs = 5000): Promise<void> {
  try {
    await page.evaluate(
      async (selectors: string[], timeout: number) => {
        const visibleLoaders = () =>
          selectors.flatMap((selector) => {
            const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
            return els.filter((el) => {
              const rect = el.getBoundingClientRect();
              const style = window.getComputedStyle(el);
              return (
                el.offsetParent !== null &&
                style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                parseFloat(style.opacity) > 0.1 &&
                rect.width > 10 &&
                rect.height > 10
              );
            });
          });

        const start = Date.now();
        while (Date.now() - start < timeout) {
          if (visibleLoaders().length === 0) break;
          await new Promise((r) => setTimeout(r, 200));
        }
      },
      LOADER_SELECTORS,
      maxWaitMs,
    );
  } catch {
    /* ignore — best effort */
  }
}

/** Force-hide any remaining loader overlays before taking the screenshot. */
export async function hideLoaders(page: Page): Promise<void> {
  try {
    await page.evaluate((selectors: string[]) => {
      selectors.forEach((selector) => {
        document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
          el.style.display = 'none';
          el.style.opacity = '0';
          el.style.visibility = 'hidden';
        });
      });
    }, LOADER_SELECTORS);
  } catch {
    /* ignore — best effort */
  }
}

/** Dispatch synthetic user-interaction events to wake lazy/optimized scripts. */
export async function simulateInteraction(page: Page): Promise<void> {
  try {
    await page.mouse.move(100, 100);
    await page.evaluate(() => {
      window.scrollBy(0, 50);
      ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'wheel'].forEach((evt) =>
        window.dispatchEvent(new Event(evt)),
      );
    });
    await page.mouse.move(200, 200);
    await page.evaluate(() => window.scrollBy(0, -50));
  } catch {
    /* ignore — best effort */
  }
}
