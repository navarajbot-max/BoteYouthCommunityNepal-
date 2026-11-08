/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const DEFAULT_CULTURE_PLACEHOLDER = '/favicon.svg';
export const DEFAULT_AVATAR_PLACEHOLDER = '/assets/leader_avatar_placeholder.svg';

/**
 * Returns a valid, non-empty image source string or null/fallback.
 * Guarantees that an empty string ("") is NEVER passed to the 'src' attribute.
 */
export function getSafeImageSrc(
  src?: string | null,
  fallback?: string
): string | null {
  if (typeof src !== 'string') {
    return fallback && fallback.trim() ? fallback.trim() : null;
  }
  const trimmed = src.trim();
  if (trimmed === '') {
    return fallback && fallback.trim() ? fallback.trim() : null;
  }
  return trimmed;
}
