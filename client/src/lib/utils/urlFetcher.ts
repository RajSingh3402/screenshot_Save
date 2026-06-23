import http from 'http';
import https from 'https';

export interface UrlCheckResult {
  status: 'success' | 'failed';
  statusCode: number | null;
  responseTime: number;
  pageTitle: string | null;
  error: string | null;
}

export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

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
    let clientReq: http.ClientRequest | null = null;
    let timer: NodeJS.Timeout | null = null;
    let resolved = false;

    const done = (result: UrlCheckResult) => {
      if (resolved) return;
      resolved = true;
      if (timer) clearTimeout(timer);
      resolve(result);
    };

    timer = setTimeout(() => {
      if (clientReq) {
        clientReq.destroy();
      }
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
      const options = {
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SiteWatch/1.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        rejectUnauthorized: false, // Ignore self-signed certificates
      };

      const requester = parsedUrl.protocol === 'https:' ? https : http;

      clientReq = requester.get(urlString, options, (res) => {
        const statusCode = res.statusCode || null;
        const contentType = res.headers['content-type'] || '';

        let responseData = '';
        res.setEncoding('utf8');

        const isHtml = contentType.toLowerCase().includes('text/html');

        res.on('data', (chunk) => {
          if (isHtml && responseData.length < 50000) {
            responseData += chunk;
          }
        });

        res.on('end', () => {
          const responseTime = Date.now() - startTime;

          if (statusCode && statusCode >= 400) {
            done({
              status: 'failed',
              statusCode,
              responseTime,
              pageTitle: null,
              error: `HTTP Error ${statusCode}`,
            });
            return;
          }

          let pageTitle = null;
          if (isHtml) {
            const titleMatch = responseData.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
            if (titleMatch && titleMatch[1]) {
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
      });

      clientReq.on('error', (err: any) => {
        let errorMsg = err.message || 'Connection failure';
        if (err.code === 'ENOTFOUND') {
          errorMsg = 'Domain not found';
        } else if (err.code === 'ECONNREFUSED') {
          errorMsg = 'Connection refused';
        } else if (err.code === 'ECONNRESET') {
          errorMsg = 'Connection reset';
        }

        done({
          status: 'failed',
          statusCode: null,
          responseTime: Date.now() - startTime,
          pageTitle: null,
          error: errorMsg,
        });
      });
    } catch (e: any) {
      done({
        status: 'failed',
        statusCode: null,
        responseTime: 0,
        pageTitle: null,
        error: e.message || 'Initialization error',
      });
    }
  });
}
