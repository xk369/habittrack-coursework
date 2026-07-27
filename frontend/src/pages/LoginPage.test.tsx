import { describe, expect, it } from 'vitest';

import { safeNextPath } from './LoginPage';

describe('safeNextPath', () => {
  it('keeps internal post-login paths', () => {
    expect(safeNextPath('/habits/1')).toBe('/habits/1');
    expect(safeNextPath('/profile?tab=settings')).toBe('/profile?tab=settings');
  });

  it('rejects external or protocol-relative redirects', () => {
    expect(safeNextPath(null)).toBe('/');
    expect(safeNextPath('https://example.com')).toBe('/');
    expect(safeNextPath('//example.com')).toBe('/');
    expect(safeNextPath('/\\example.com')).toBe('/');
  });
});
