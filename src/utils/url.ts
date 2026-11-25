export interface SanitizeUrlOptions {
  allowMailto?: boolean;
  allowTel?: boolean;
}

// eslint-disable-next-line no-control-regex
const CONTROL_AND_WHITESPACE_PREFIX_REGEX = /^[\u0000-\u0020\u007F]+/;
// eslint-disable-next-line no-control-regex
const CONTROL_CHAR_REGEX = /[\u0000-\u001F\u007F]/g;
const SCHEME_REGEX = /^([a-zA-Z][a-zA-Z0-9+.-]*):/;
const SAFE_DATA_IMAGE_REGEX =
  /^data:image\/(?:png|jpeg|jpg|gif|webp|avif);base64,[a-z0-9+/=]+$/i;

/**
 * Validates href URLs for links rendered by navigation and profile components.
 * Blocks dangerous protocols (e.g., javascript:, vbscript:, data:, protocol-relative //)
 * while permitting relative paths and standard http/https (plus optional mailto/tel) URLs.
 */
export function sanitizeUrl(
  url?: string | null,
  options: SanitizeUrlOptions = {}
): string | undefined {
  if (typeof url !== 'string') {
    return undefined;
  }

  const cleaned = url.replace(CONTROL_CHAR_REGEX, '').trim();
  if (!cleaned) {
    return undefined;
  }

  // Block protocol-relative URLs (e.g. //untrusted.example)
  if (cleaned.startsWith('//')) {
    return undefined;
  }

  if (
    cleaned.startsWith('/') ||
    cleaned.startsWith('./') ||
    cleaned.startsWith('../') ||
    cleaned.startsWith('#') ||
    cleaned.startsWith('?')
  ) {
    return cleaned;
  }

  const normalizedForScheme = cleaned.replace(CONTROL_AND_WHITESPACE_PREFIX_REGEX, '');
  const schemeMatch = normalizedForScheme.match(SCHEME_REGEX);
  if (!schemeMatch) {
    // Plain relative path without scheme
    return cleaned;
  }

  const scheme = schemeMatch[1].toLowerCase();
  const { allowMailto = true, allowTel = true } = options;

  if (scheme === 'http' || scheme === 'https') {
    return cleaned;
  }
  if (scheme === 'mailto' && allowMailto) {
    return cleaned;
  }
  if (scheme === 'tel' && allowTel) {
    return cleaned;
  }

  return undefined;
}

/**
 * Validates image src strings. Permits relative paths, http/https, blob URLs,
 * and strictly raster base64 data URIs (excluding SVG data URIs that can embed scripts).
 */
export function sanitizeImageUrl(url?: string | null): string | undefined {
  if (typeof url !== 'string') {
    return undefined;
  }

  const cleaned = url.replace(CONTROL_CHAR_REGEX, '').trim();
  if (!cleaned || cleaned.startsWith('//')) {
    return undefined;
  }

  if (cleaned.startsWith('/') || cleaned.startsWith('./') || cleaned.startsWith('../')) {
    return cleaned;
  }

  const schemeMatch = cleaned.match(SCHEME_REGEX);
  if (!schemeMatch) {
    return cleaned;
  }

  const scheme = schemeMatch[1].toLowerCase();
  if (scheme === 'http' || scheme === 'https' || scheme === 'blob') {
    return cleaned;
  }

  if (scheme === 'data' && SAFE_DATA_IMAGE_REGEX.test(cleaned)) {
    return cleaned;
  }

  return undefined;
}
