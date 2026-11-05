/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Universal Favicon & Domain Head Manager
 * Ensures that uploaded logos immediately display as Chrome tab favicons,
 * and updates OpenGraph / Schema.org metadata in real-time.
 */

export function getMimeTypeFromUrl(url: string): string {
  if (!url) return 'image/x-icon';
  const clean = url.toLowerCase().split('?')[0];
  if (clean.endsWith('.svg') || clean.startsWith('data:image/svg')) return 'image/svg+xml';
  if (clean.endsWith('.png') || clean.startsWith('data:image/png')) return 'image/png';
  if (clean.endsWith('.jpg') || clean.endsWith('.jpeg') || clean.startsWith('data:image/jpeg')) return 'image/jpeg';
  if (clean.endsWith('.webp') || clean.startsWith('data:image/webp')) return 'image/webp';
  if (clean.endsWith('.ico') || clean.startsWith('data:image/x-icon')) return 'image/x-icon';
  return 'image/x-icon';
}

/**
 * Force Google Chrome & browsers to immediately re-render the tab favicon
 * by replacing the link DOM tags with fresh elements.
 */
export function applyFaviconToDocument(faviconUrl?: string | null): void {
  if (typeof document === 'undefined') return;

  const url = faviconUrl && faviconUrl.trim()
    ? faviconUrl.trim()
    : (localStorage.getItem('bycn_favicon') || '/favicon.svg');

  const mimeType = getMimeTypeFromUrl(url);

  // Chrome will often cache favicons unless the link tag is replaced or query timestamped
  const finalHref = url.startsWith('data:')
    ? url
    : url.includes('?')
    ? `${url}&v=${Date.now()}`
    : `${url}?v=${Date.now()}`;

  // 1. Update or replace primary favicon
  const existingLinks = document.querySelectorAll("link[rel*='icon'], link[rel*='apple-touch-icon']");
  existingLinks.forEach((el) => el.remove());

  // Create primary icon
  const link1 = document.createElement('link');
  link1.id = 'bycn-favicon';
  link1.rel = 'icon';
  link1.type = mimeType;
  link1.href = finalHref;
  document.head.appendChild(link1);

  // Create shortcut icon
  const link2 = document.createElement('link');
  link2.id = 'bycn-shortcut-favicon';
  link2.rel = 'shortcut icon';
  link2.type = mimeType;
  link2.href = finalHref;
  document.head.appendChild(link2);

  // Create Apple touch icon
  const link3 = document.createElement('link');
  link3.id = 'bycn-apple-icon';
  link3.rel = 'apple-touch-icon';
  link3.href = finalHref;
  document.head.appendChild(link3);

  // 2. Sync OpenGraph & Twitter Cards
  const ogImg = document.getElementById('bycn-og-image') as HTMLMetaElement | null;
  if (ogImg) ogImg.content = url;

  const twImg = document.getElementById('bycn-twitter-image') as HTMLMetaElement | null;
  if (twImg) twImg.content = url;

  // 3. Sync Schema.org Organization Logo
  try {
    const schemaScript = document.getElementById('bycn-schema-org');
    if (schemaScript && schemaScript.textContent) {
      const data = JSON.parse(schemaScript.textContent);
      if (Array.isArray(data['@graph'])) {
        const org = data['@graph'].find((item: any) => item['@type'] === 'Organization');
        if (org) {
          org.logo = url;
          org.image = url;
          schemaScript.textContent = JSON.stringify(data, null, 2);
        }
      }
    }
  } catch (e) {
    // schema update silent
  }

  // 4. Save to localStorage for instant pre-hydration paint
  try {
    localStorage.setItem('bycn_favicon', url);
  } catch (e) {}

  window.dispatchEvent(new CustomEvent('bycn_favicon_applied', { detail: { favicon: url } }));
}

/**
 * Updates Canonical URL and OpenGraph URL for Custom Domain
 */
export function updateCanonicalDomain(domainName?: string | null): void {
  if (typeof document === 'undefined' || !domainName) return;

  const cleanDomain = domainName.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  if (!cleanDomain) return;

  const fullUrl = `https://${cleanDomain}/`;

  // Update canonical
  let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = fullUrl;

  // Update og:url
  let ogUrl = document.querySelector("meta[property='og:url']") as HTMLMetaElement | null;
  if (ogUrl) {
    ogUrl.content = fullUrl;
  }
}

/**
 * Synchronize Google Search Console Verification Meta Tag in <head>
 * If code is empty/null, removes any existing verification meta tags from <head> and clears storage.
 */
export function updateGoogleSiteVerification(code?: string | null): void {
  if (typeof document === 'undefined') return;
  const cleanCode = (code || '').trim();

  // If empty or explicitly cleared, remove verification meta tags completely
  if (!cleanCode) {
    try {
      localStorage.removeItem('bycn_google_site_verification');
    } catch {}
    const existing = document.querySelectorAll("#bycn-gsc-verification, meta[name='google-site-verification']");
    existing.forEach((el) => el.remove());
    return;
  }

  // Extract content attribute if user pasted full <meta ... content="..." />
  let finalToken = cleanCode;
  const match = cleanCode.match(/content=["']([^"']+)["']/i);
  if (match) {
    finalToken = match[1];
  }

  let meta = document.getElementById('bycn-gsc-verification') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.querySelector("meta[name='google-site-verification']");
  }
  if (!meta) {
    meta = document.createElement('meta');
    meta.id = 'bycn-gsc-verification';
    meta.name = 'google-site-verification';
    document.head.appendChild(meta);
  }
  meta.content = finalToken;

  try {
    localStorage.setItem('bycn_google_site_verification', finalToken);
  } catch {}
}
