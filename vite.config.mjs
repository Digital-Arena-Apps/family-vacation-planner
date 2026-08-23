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

const inlineStartupGuard = `<script id="phase1InlineStartupGuard">
(()=>{
  const d=window.__VP_PHASE1_DIAGNOSTICS__ ||= {errors:[],inlineGuard:true};
  const rec=(kind,value)=>{d.errors.push({kind,message:String(value?.message||value||'Unknown startup error'),at:new Date().toISOString()});if(d.errors.length>8)d.errors.shift();};
  addEventListener('error',e=>rec('error',e.error||e.message));
  addEventListener('unhandledrejection',e=>rec('unhandledrejection',e.reason));
  setTimeout(()=>{
    const splash=document.querySelector('#vpStartupSplash');
    if(!splash||window.__VP_BOOT_STATE__?.revealed)return;
    d.fallbackTriggered=true;d.fallbackAt=new Date().toISOString();
    let onboarded=false;try{onboarded=!!localStorage.getItem('ffvp_onboarded');}catch{}
    document.querySelector('#landingScreen')?.classList.add('hidden');
    if(onboarded)document.querySelector('#onboarding')?.classList.add('hidden');
    else document.querySelector('#onboarding')?.classList.remove('hidden');
    splash.remove();document.querySelector('#vpStartupCriticalCss')?.remove();
    console.error('[Phase 1] Inline startup guard released a stuck Orlando splash.',d.errors);
  },3600);
})();
</script>`;

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

        // Runs while the HTML parser is still active, before deferred app scripts execute.
        // If the Orlando bootstrap fails, this guard still releases the splash independently.
        return preserved.replace('</body>', `  ${inlineStartupGuard}\n</body>`);
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
