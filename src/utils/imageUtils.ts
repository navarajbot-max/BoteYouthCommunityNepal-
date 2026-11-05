/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const DEFAULT_CULTURE_PLACEHOLDER =
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800';

export const DEFAULT_AVATAR_PLACEHOLDER =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';

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
