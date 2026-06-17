/**
 * Utility to safely validate redirect URLs for open redirect protection.
 */
export const isSafeRedirect = (url: string) => {
  return url.startsWith('/') && !url.startsWith('//') && !url.includes('\\');
};
