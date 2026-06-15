import http from 'node:http';
import https from 'node:https';
import type { UrlCheckResult } from './types';

/**
 * Normalize a user/Excel supplied URL: trim it and prepend `https://` when no
 * protocol is present. Replaces the prefixing logic that was previously
 * duplicated across the UI, the websites API, the bulk API and Excel parsing.
 */
export function normalizeUrl(raw: string | null | undefined): string {
  const url = (raw ?? '').trim();
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Ping a URL: accessibility, status code, response time and page <title>.
 * Used by the Excel verification flow.
 */
export function checkUrlStatus(urlString: string, timeoutMs = 8000): Promise<UrlCheckResult> {
  return new Promise((resolve) => {
    if (!urlString || !isValidUrl(urlString)) {
      resolve({
        status: 'failed',
        statusCode: null,
        responseTime: 0,
        pageTitle: null,
        error: 'Invalid or missing URL protocol',
      });
      return;
    }

    const startTime = Date.now();
    let clientReq: http.ClientRequest | undefined;
    let resolved = false;

    const done = (result: UrlCheckResult) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timer);
      resolve(result);
    };

    const timer = setTimeout(() => {
      clientReq?.destroy();
      done({
        status: 'failed',
        statusCode: null,
        responseTime: Date.now() - startTime,
        pageTitle: null,
        error: 'Request Timeout',
      });
    }, timeoutMs);

    try {
      const parsedUrl = new URL(urlString);
      const requester = parsedUrl.protocol === 'https:' ? https : http;

      clientReq = requester.get(
        urlString,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SiteWatch/1.0',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
          },
          // Ignore self-signed certificates for a friendly monitoring check.
          rejectUnauthorized: false,
        },
        (res) => {
          const statusCode = res.statusCode ?? 0;
          const contentType = res.headers['content-type'] || '';
          const isHtml = contentType.toLowerCase().includes('text/html');

          let responseData = '';
          res.setEncoding('utf8');

          res.on('data', (chunk: string) => {
            // Cap captured HTML at 50KB to preserve memory.
            if (isHtml && responseData.length < 50000) responseData += chunk;
          });

          res.on('end', () => {
            const responseTime = Date.now() - startTime;

            if (statusCode >= 400) {
              done({
                status: 'failed',
                statusCode,
                responseTime,
                pageTitle: null,
                error: `HTTP Error ${statusCode}`,
              });
              return;
            }

            let pageTitle: string | null = null;
            if (isHtml) {
              const titleMatch = responseData.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
              if (titleMatch?.[1]) {
                pageTitle = titleMatch[1]
                  .trim()
                  .replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&quot;/g, '"')
                  .replace(/&#39;/g, "'")
                  .replace(/\s+/g, ' ');
              }
            }

            done({
              status: 'success',
              statusCode,
              responseTime,
              pageTitle: pageTitle || 'No Title Found',
              error: null,
            });
          });
        },
      );

      clientReq.on('error', (err: NodeJS.ErrnoException) => {
        let errorMsg = err.message || 'Connection failure';
        if (err.code === 'ENOTFOUND') errorMsg = 'Domain not found';
        else if (err.code === 'ECONNREFUSED') errorMsg = 'Connection refused';
        else if (err.code === 'ECONNRESET') errorMsg = 'Connection reset';

        done({
          status: 'failed',
          statusCode: null,
          responseTime: Date.now() - startTime,
          pageTitle: null,
          error: errorMsg,
        });
      });
    } catch (e) {
      done({
        status: 'failed',
        statusCode: null,
        responseTime: 0,
        pageTitle: null,
        error: (e as Error).message || 'Initialization error',
      });
    }
  });
}
