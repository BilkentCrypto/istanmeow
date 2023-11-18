import httpProxy from 'http-proxy';
import qs from 'qs';

export const config = {
  api: {
    // Enable `externalResolver` option in Next.js
    externalResolver: true,
    bodyParser: false,
  },
};

export default (req, res) =>
  new Promise((resolve, reject) => {
    const proxy = httpProxy.createProxy();

    proxy.on('proxyReq', (proxyReq, req, res, options) => {
      // Add your httpOnly cookies to the proxy request headers
      if (req.headers.cookie) {
        const cookie = qs.parse(req.headers.cookie, { delimiter: '; ' });

        if (cookie?.token) proxyReq.setHeader('token', cookie?.token);
      }
    });

    proxy.once('proxyRes', resolve).once('error', reject).web(req, res, {
      changeOrigin: true,
      target: process.env.NEXT_PUBLIC_BACK_URL,
    });
  });
