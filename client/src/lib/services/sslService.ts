import tls from 'tls';

export interface SSLCheckResult {
  status: string;
  expiryDate: Date | null;
  daysRemaining: number | null;
  warning: boolean;
  error?: string;
}

export async function checkSSL(urlString: string): Promise<SSLCheckResult> {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(urlString);
      if (parsedUrl.protocol !== 'https:') {
        return resolve({
          status: 'No SSL (HTTP)',
          expiryDate: null,
          daysRemaining: null,
          warning: false,
        });
      }
      const hostname = parsedUrl.hostname;
      const port = parsedUrl.port || 443;

      const socket = tls.connect(
        {
          host: hostname,
          port: typeof port === 'string' ? parseInt(port, 10) : port,
          servername: hostname,
          rejectUnauthorized: false,
          timeout: 10000,
        },
        () => {
          const cert = socket.getPeerCertificate(true);
          socket.destroy();
          if (!cert || Object.keys(cert).length === 0) {
            return resolve({
              status: 'Invalid Certificate',
              expiryDate: null,
              daysRemaining: null,
              warning: true,
            });
          }

          const expiryDate = new Date(cert.valid_to);
          const now = new Date();
          const diffTime = expiryDate.getTime() - now.getTime();
          const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const authorized = socket.authorized;

          resolve({
            status: authorized ? 'Valid' : 'Invalid/Self-Signed',
            expiryDate: expiryDate,
            daysRemaining: daysRemaining,
            warning: daysRemaining < 30 || !authorized,
          });
        }
      );

      socket.on('error', (err) => {
        socket.destroy();
        resolve({
          status: 'Connection Error',
          expiryDate: null,
          daysRemaining: null,
          warning: true,
          error: err.message,
        });
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve({
          status: 'Timeout',
          expiryDate: null,
          daysRemaining: null,
          warning: true,
        });
      });
    } catch (e: any) {
      resolve({
        status: 'Error',
        expiryDate: null,
        daysRemaining: null,
        warning: true,
        error: e.message,
      });
    }
  });
}
