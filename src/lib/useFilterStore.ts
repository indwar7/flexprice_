import { useEffect, useMemo } from 'react';
import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * `useFilterStore` — Challenge A
 *
 * Multi-dimensional filter persistence without URL bloat.
 *
 * **What it does**
 * - Holds the active filter state for a given page (e.g. invoices, customers).
 * - Persists to `sessionStorage` keyed by route, so refreshing the page or
 *   navigating away and back restores the filters.
 * - Syncs only a *shallow fingerprint* (an 8-char hex hash) to the URL,
 *   so a page can be bookmarked or shared. The fingerprint is enough for
 *   the receiving page to decide whether the cached state matches.
 *
 * **Why a fingerprint instead of full state in the URL?**
 * A naive implementation serialises the entire filter object into the
 * query string. For a tableful of multi-select filters this becomes long,
 * unreadable, and forces a parse + serialise on every render. A fingerprint
 * is O(1) on every render and the storage layer holds the real state.
 */

export type FilterValue = string | number | boolean | null | string[] | number[];
export type FilterMap = Record<string, FilterValue>;

export interface FilterStoreApi<F extends FilterMap = FilterMap> {
  filters: F;
  /** Set or update a single filter key. Pass `null` or `undefined` to clear. */
  setFilter: <K extends keyof F>(key: K, value: F[K] | null | undefined) => void;
  /** Replace the whole filter object (e.g. apply a saved preset). */
  setFilters: (next: Partial<F>) => void;
  /** Reset back to the page's defaults. */
  resetFilters: () => void;
  /** Read the current filters. (Equivalent to `useStore.getState().filters`.) */
  getFilters: () => F;
}

export interface CreateFilterStoreOptions<F extends FilterMap> {
  /** Page key — also the storage key, e.g. "invoices". */
  pageKey: string;
  /** Initial / default filter values. */
  defaults: F;
  /**
   * Storage. Defaults to `sessionStorage`. Pass `localStorage` if you'd
   * rather persist across tabs.
   */
  storage?: Storage;
}

const URL_PARAM = 'f';

/**
 * Build a Zustand store + hook for a specific filter shape on a specific page.
 *
 * @example
 * type InvoiceFilters = { status: string[]; q: string; from: string | null; to: string | null };
 * const useInvoiceFilters = createFilterStore<InvoiceFilters>({
 *   pageKey: 'invoices',
 *   defaults: { status: [], q: '', from: null, to: null },
 * });
 */
export function createFilterStore<F extends FilterMap>(
  options: CreateFilterStoreOptions<F>,
): UseBoundStore<StoreApi<FilterStoreApi<F>>> {
  const { pageKey, defaults, storage } = options;
  const storageKey = `filters:${pageKey}`;

  const useStore = create<FilterStoreApi<F>>()(
    persist(
      (set, get) => ({
        filters: { ...defaults },
        setFilter: (key, value) => {
          set((s) => {
            const next = { ...s.filters };
            if (value === null || value === undefined) {
              delete (next as Record<string, unknown>)[key as string];
              // Restore default if defaults supplied one.
              if (key in defaults) {
                (next as Record<string, unknown>)[key as string] = defaults[key];
              }
            } else {
              (next as Record<string, unknown>)[key as string] = value as unknown;
            }
            return { filters: next as F };
          });
        },
        setFilters: (partial) => {
          set((s) => ({ filters: { ...s.filters, ...partial } }));
        },
        resetFilters: () => set({ filters: { ...defaults } }),
        getFilters: () => get().filters,
      }),
      {
        name: storageKey,
        storage: createJSONStorage(() => storage ?? sessionStorage),
        partialize: (s) => ({ filters: s.filters }),
      },
    ),
  );

  return useStore;
}

/**
 * Lightweight, non-cryptographic 32-bit FNV-1a hash of a JSON-serialisable
 * value. Two equal-by-value inputs produce the same fingerprint.
 */
export function fingerprint(value: unknown): string {
  const json = stableStringify(value);
  let hash = 0x811c9dc5;
  for (let i = 0; i < json.length; i++) {
    hash ^= json.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  // Force unsigned and pad to 8 hex chars.
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function stableStringify(v: unknown): string {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(stableStringify).join(',') + ']';
  const keys = Object.keys(v as Record<string, unknown>).sort();
  return (
    '{' +
    keys
      .map((k) => JSON.stringify(k) + ':' + stableStringify((v as Record<string, unknown>)[k]))
      .join(',') +
    '}'
  );
}

export interface UseFilterUrlSyncOptions {
  /** The query parameter to write the fingerprint to (default `f`). */
  param?: string;
  /** Skip URL writes — useful in Storybook or tests. */
  disabled?: boolean;
}

/**
 * Sync a shallow fingerprint of the current filters to `?f=<hex>` so the
 * page is bookmarkable and shareable without inflating the URL. Returns
 * the current fingerprint.
 */
export function useFilterFingerprint(filters: unknown, options: UseFilterUrlSyncOptions = {}): string {
  const { param = URL_PARAM, disabled = false } = options;
  const hash = useMemo(() => fingerprint(filters), [filters]);

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (url.searchParams.get(param) === hash) return;
    url.searchParams.set(param, hash);
    window.history.replaceState(null, '', url.toString());
  }, [hash, param, disabled]);

  return hash;
}
