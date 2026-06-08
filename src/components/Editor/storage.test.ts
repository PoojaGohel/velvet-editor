import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { safeGetItem, safeSetItem } from './storage';

describe('safeGetItem', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => 'saved-html'),
      setItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads from localStorage', () => {
    expect(safeGetItem('draft')).toBe('saved-html');
  });

  it('returns null when localStorage throws', () => {
    vi.mocked(localStorage.getItem).mockImplementation(() => {
      throw new Error('SecurityError');
    });
    expect(safeGetItem('draft')).toBeNull();
  });
});

describe('safeSetItem', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('writes to localStorage', () => {
    expect(safeSetItem('draft', '<p>hi</p>')).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('draft', '<p>hi</p>');
  });

  it('returns false when localStorage throws', () => {
    vi.mocked(localStorage.setItem).mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(safeSetItem('draft', 'x')).toBe(false);
  });
});
