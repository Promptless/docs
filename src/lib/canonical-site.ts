const DEFAULT_SITE_URL = 'https://docs.gopromptless.ai';

export function resolveCanonicalSiteUrl(site?: URL): string {
  return site?.toString() || process.env.SITE_URL || DEFAULT_SITE_URL;
}

export function toAbsoluteUrl(pathname: string, site?: URL): string {
  return new URL(pathname, resolveCanonicalSiteUrl(site)).toString();
}
