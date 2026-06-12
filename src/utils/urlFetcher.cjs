const http = require('http');
const https = require('https');
const { URL } = require('url');

/**
 * Check if a URL has a valid structure.
 * @param {string} urlString
 * @returns {boolean}
 */
function isValidUrl(urlString) {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

/**
 * Checks a URL's status: checks accessibility, status code, response time, and extracts the page title.
 *
 * @param {string} urlString - The URL to ping.
 * @param {number} timeoutMs - Timeout limit in milliseconds.
 * @returns {Promise<{status: 'success'|'failed', statusCode: number|null, responseTime: number, pageTitle: string|null, error: string|null}>}
 */
function checkUrlStatus(urlString, timeoutMs = 8000) {
  return new Promise((resolve) => {
    if (!urlString || !isValidUrl(urlString)) {
      resolve({
        status: 'failed',
        statusCode: null,
        responseTime: 0,
        pageTitle: null,
        error: 'Invalid or missing URL protocol'
      });
      return;
    }

    const startTime = Date.now();
    let clientReq;
    let timer;
    let resolved = false;

    const done = (result) => {
      if (resolved) return;
      resolved = true;
      if (timer) clearTimeout(timer);
      resolve(result);
    };

    // Set request timeout timer
    timer = setTimeout(() => {
      if (clientReq) {
        clientReq.destroy();
      }
      done({
        status: 'failed',
        statusCode: null,
        responseTime: Date.now() - startTime,
        pageTitle: null,
        error: 'Request Timeout'
      });
    }, timeoutMs);

    try {
      const parsedUrl = new URL(urlString);
      const options = {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SiteWatch/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        rejectUnauthorized: false // Ignore self-signed certificates for friendly monitoring check
      };

      const requester = parsedUrl.protocol === 'https:' ? https : http;

      clientReq = requester.get(urlString, options, (res) => {
        const statusCode = res.statusCode;
        const contentType = res.headers['content-type'] || '';
        
        let responseData = '';
        res.setEncoding('utf8');

        // Only capture response data for title parsing if it's text/html, capping at 50KB to preserve memory
        const isHtml = contentType.toLowerCase().includes('text/html');

        res.on('data', (chunk) => {
          if (isHtml && responseData.length < 50000) {
            responseData += chunk;
          }
        });

        res.on('end', () => {
          const responseTime = Date.now() - startTime;
          
          if (statusCode >= 400) {
            done({
              status: 'failed',
              statusCode,
              responseTime,
              pageTitle: null,
              error: `HTTP Error ${statusCode}`
            });
            return;
          }

          let pageTitle = null;
          if (isHtml) {
            // Regex to parse <title> tag
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
            error: null
          });
        });
      });

      clientReq.on('error', (err) => {
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
          error: errorMsg
        });
      });

    } catch (e) {
      done({
        status: 'failed',
        statusCode: null,
        responseTime: 0,
        pageTitle: null,
        error: e.message || 'Initialization error'
      });
    }
  });
}

module.exports = { checkUrlStatus, isValidUrl };
