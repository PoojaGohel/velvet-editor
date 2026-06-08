import { describe, expect, it } from 'vitest';
import { cn, hexToRgb, COLORS, FONTS, FONT_SIZES } from './utils';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('filters falsy values', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b');
  });
});

describe('hexToRgb', () => {
  it('converts 6-digit hex with hash', () => {
    expect(hexToRgb('#a855f7')).toBe('168, 85, 247');
  });

  it('converts hex without hash', () => {
    expect(hexToRgb('10b981')).toBe('16, 185, 129');
  });

  it('returns default purple for invalid input', () => {
    expect(hexToRgb('not-a-color')).toBe('168, 85, 247');
  });
});

describe('constants', () => {
  it('exports color palette', () => {
    expect(COLORS.length).toBeGreaterThan(0);
    expect(COLORS[0]).toMatch(/^#/);
  });

  it('exports font lists', () => {
    expect(FONTS.length).toBeGreaterThan(5);
    expect(FONT_SIZES.every((s) => s.value.endsWith('px'))).toBe(true);
  });
});
