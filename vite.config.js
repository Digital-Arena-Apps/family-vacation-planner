import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const legacyAssets = [
  'app.js',
  'styles.css',
  'decision-demo-loader.js',
  'decision-demo.js',
  'decision-demo.css',
  'orlando-early-access.css',
  'base-location.js',
  'family-ui-test.js',
  'startup-safety.js',
  'demo-shell.js',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'brand-mark.png',
  'brand-logo.png',
  'landing-scenic.png'
];

const legacyAssetNames = new Set(legacyAssets);

function preserveLegacyAssetUrls() {
  return {
    name: 'preserve-legacy-asset-urls',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const preserved = html.replace(
          /<(link|script|img)\b([^>]*?(?:src|href)=["']([^"']+)["'][^>]*)>/gi,
          (full, tag, attrs, url) => {
            const clean = url.split('?')[0].replace(/^\//, '');
            if (!legacyAssetNames.has(clean) || /\bvite-ignore\b/i.test(attrs)) return full;
            return `<${tag} vite-ignore${attrs}>`;
          }
        );

        // Independent of the Orlando loader: if its init path throws before its own
        // timeout is scheduled, this guard still releases the splash after 3.6s.
        return preserved.replace(
          '</body>',
          '  <script vite-ignore src="startup-safety.js" defer></script>\n</body>'
        );
      }
    }
  };
}

export default defineConfig({
  base: '/',
  publicDir: false,
  plugins: [
    preserveLegacyAssetUrls(),
    viteStaticCopy({
      targets: [
        ...legacyAssets.map((src) => ({ src, dest: '.' })),
        { src: '.demo-build/*', dest: '.demo-build' }
      ]
    }),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectRegister: null,
      manifest: false,
      injectManifest: {
        injectionPoint: undefined
      },
      devOptions: {
        enabled: false
      }
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020'
  }
});
