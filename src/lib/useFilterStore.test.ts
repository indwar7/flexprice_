import { describe, expect, it, beforeEach } from 'vitest';
import { act } from 'react';
import { renderHook } from '@testing-library/react';
import { createFilterStore, fingerprint } from './useFilterStore';

describe('fingerprint', () => {
  it('is stable across key order', () => {
    const a = fingerprint({ status: 'active', q: 'acme' });
    const b = fingerprint({ q: 'acme', status: 'active' });
    expect(a).toBe(b);
  });

  it('changes when values change', () => {
    expect(fingerprint({ q: 'a' })).not.toBe(fingerprint({ q: 'b' }));
  });

  it('returns 8 hex chars', () => {
    expect(fingerprint({ x: 1 })).toMatch(/^[0-9a-f]{8}$/);
  });
});

describe('createFilterStore', () => {
  type Filters = { status: string; q: string };
  let useStore: ReturnType<typeof createFilterStore<Filters>>;

  beforeEach(() => {
    sessionStorage.clear();
    useStore = createFilterStore<Filters>({
      pageKey: `test-${Math.random().toString(36).slice(2)}`,
      defaults: { status: 'all', q: '' },
    });
  });

  it('starts at the defaults', () => {
    const { result } = renderHook(() => useStore());
    expect(result.current.filters).toEqual({ status: 'all', q: '' });
  });

  it('setFilter updates a single key', () => {
    const { result } = renderHook(() => useStore());
    act(() => result.current.setFilter('q', 'acme'));
    expect(result.current.filters.q).toBe('acme');
  });

  it('resetFilters returns to defaults', () => {
    const { result } = renderHook(() => useStore());
    act(() => result.current.setFilter('status', 'active'));
    act(() => result.current.resetFilters());
    expect(result.current.filters.status).toBe('all');
  });

  it('persists to sessionStorage under the page key', () => {
    const useScoped = createFilterStore<Filters>({
      pageKey: 'persist-check',
      defaults: { status: 'all', q: '' },
    });
    const { result } = renderHook(() => useScoped());
    act(() => result.current.setFilter('q', 'hello'));
    const raw = sessionStorage.getItem('filters:persist-check');
    expect(raw).toContain('hello');
  });
});
