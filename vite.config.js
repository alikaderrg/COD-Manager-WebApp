import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const addTransformIndexHtml = {
  name: 'add-transform-index-html',
  transformIndexHtml(html) {
    const scripts = [
      `window.onerror = (msg, src, line, col, err) => {
        window.parent.postMessage({
          type: 'horizons-runtime-error',
          message: msg,
          error: err ? JSON.stringify({
            name: err.name,
            message: err.message,
            stack: err.stack,
            src, line, col,
          }) : null
        }, '*');
      };`,

      `const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const addedNode of mutation.addedNodes) {
            if (
              addedNode.nodeType === Node.ELEMENT_NODE &&
              (addedNode.tagName?.toLowerCase() === 'vite-error-overlay' ||
               addedNode.classList?.contains('backdrop'))
            ) {
              const overlay = addedNode.shadowRoot?.querySelector('.backdrop');
              if (overlay) {
                const doc = new DOMParser().parseFromString(overlay.outerHTML, 'text/html');
                const msg = doc.querySelector('.message-body')?.textContent?.trim() || '';
                const file = doc.querySelector('.file')?.textContent?.trim() || '';
                const errMsg = msg + (file ? ' File: ' + file : '');
                window.parent.postMessage({ type: 'horizons-vite-error', error: errMsg }, '*');
              }
            }
          }
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });`,

      `const originalConsoleError = console.error;
      console.error = function(...args) {
        originalConsoleError.apply(console, args);
        const errorString = args.map(a => a instanceof Error ? a.stack || (a.name + ': ' + a.message) : JSON.stringify(a)).join(' ');
        window.parent.postMessage({ type: 'horizons-console-error', error: errorString }, '*');
      };`,

      `const originalFetch = window.fetch;
      window.fetch = function(...args) {
        const url = args[0] instanceof Request ? args[0].url : args[0];
        if (url.startsWith('ws:') || url.startsWith('wss:')) return originalFetch.apply(this, args);
        return originalFetch.apply(this, args)
          .then(async res => {
            const type = res.headers.get('Content-Type') || '';
            const isHtml = type.includes('text/html') || type.includes('application/xhtml+xml');
            if (!res.ok && !isHtml) {
              const body = await res.clone().text();
              console.error(\`Fetch error from \${res.url}: \${body}\`);
            }
            return res;
          })
          .catch(err => {
            if (!url.match(/\\.html?$/)) console.error(err);
            throw err;
          });
      };`
    ];

    return {
      html,
      tags: scripts.map(script => ({
        tag: 'script',
        attrs: { type: 'module' },
        children: script,
        injectTo: 'head',
      })),
    };
  },
};

console.warn = () => {};

export default defineConfig({
  plugins: [react(), addTransformIndexHtml],
  server: {
    cors: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
    allowedHosts: true,
  },
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/', // ✅ Important for Vercel routing
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html',
    },
  },
});
