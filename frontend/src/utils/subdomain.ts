const ROOT_DOMAIN = import.meta.env.VITE_ROOT_DOMAIN || 'bookinghub.com';

export function getSlugFromSubdomain(): string | null {
  if (typeof window === 'undefined') return null;
  const hostname = window.location.hostname;

  // Local dev: check for *.localhost pattern
  if (hostname.endsWith('.localhost')) {
    const slug = hostname.replace('.localhost', '');
    if (slug && !slug.includes('.')) return slug;
    return null;
  }

  // Production: check for *.rootdomain pattern
  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    const subdomain = hostname.replace(`.${ROOT_DOMAIN}`, '');
    if (subdomain && !subdomain.includes('.')) return subdomain;
    return null;
  }

  return null;
}

export function isCustomerPortal(): boolean {
  return getSlugFromSubdomain() !== null;
}

export function getPortalUrl(slug: string): string {
  if (typeof window === 'undefined') return `/${slug}`;
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
    return `http://${slug}.localhost:${window.location.port}`;
  }
  return `https://${slug}.${ROOT_DOMAIN}`;
}
