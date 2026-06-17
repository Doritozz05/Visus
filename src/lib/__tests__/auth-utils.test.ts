import { describe, it, expect } from 'vitest';
import { isSafeRedirect } from '../auth-utils';

describe('isSafeRedirect', () => {
  it('should allow valid relative paths', () => {
    expect(isSafeRedirect('/library')).toBe(true);
    expect(isSafeRedirect('/settings/profile')).toBe(true);
  });

  it('should reject protocol-relative URLs', () => {
    expect(isSafeRedirect('//google.com')).toBe(false);
  });

  it('should reject absolute URLs', () => {
    expect(isSafeRedirect('https://google.com')).toBe(false);
  });

  it('should reject backslash bypasses', () => {
    expect(isSafeRedirect('/\\google.com')).toBe(false);
  });
});
