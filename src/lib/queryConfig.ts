import { QueryClient, type QueryClientConfig, type UseQueryOptions } from '@tanstack/react-query';

/**
 * `createQueryConfig` — Challenge C
 *
 * A typed builder around TanStack Query (v5) that gives every call site
 * a sensible default cache policy while letting individual hooks opt
 * into different freshness profiles.
 *
 * **Why bother?**
 * The most common React Query mistake is letting each hook re-define
 * `staleTime` inline. That makes the caching behaviour of a screen
 * impossible to reason about. With `createQueryConfig` the *default*
 * policy is set once globally, and call sites pick a named preset
 * (`REALTIME`, `DEFAULT`, `STATIC`) or override individual fields
 * declaratively.
 */

export const QueryPresets = {
  /** Always refetch — appropriate for live counters, status pollers. */
  REALTIME: {
    staleTime: 0,
    gcTime: 60 * 1000, // 1 min
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  },
  /** Sensible global default: 5 min stale, 10 min GC. */
  DEFAULT: {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },
  /** For data that rarely changes (plan definitions, feature flags). */
  STATIC: {
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },
} as const;

export type QueryPreset = keyof typeof QueryPresets;

export type QueryConfigOverrides = Partial<{
  staleTime: number;
  gcTime: number;
  refetchOnWindowFocus: boolean;
  refetchOnMount: boolean;
  retry: number | boolean;
}>;

/**
 * Build a partial `useQuery` options object from a preset name with optional
 * call-site overrides. Spread the result into your `useQuery` call.
 *
 * @example
 * useQuery({
 *   queryKey: ['invoices', filters],
 *   queryFn: fetchInvoices,
 *   ...createQueryConfig('REALTIME', { staleTime: 0 }),
 * });
 */
export function createQueryConfig(
  preset: QueryPreset = 'DEFAULT',
  overrides: QueryConfigOverrides = {},
): QueryConfigOverrides {
  return { ...QueryPresets[preset], ...overrides };
}

/**
 * Type-safe wrapper that turns the user's options into a complete
 * `useQuery` argument with the preset applied. Use this when you'd
 * rather not spread.
 */
export function withQueryConfig<TData, TError = Error>(
  options: UseQueryOptions<TData, TError> & {
    preset?: QueryPreset;
    overrides?: QueryConfigOverrides;
  },
): UseQueryOptions<TData, TError> {
  const { preset = 'DEFAULT', overrides, ...rest } = options;
  return { ...createQueryConfig(preset, overrides), ...rest } as UseQueryOptions<TData, TError>;
}

/**
 * Build a `QueryClient` pre-configured with the global default policy.
 * Pass overrides to merge into the default options.
 */
export function buildQueryClient(config: QueryClientConfig = {}): QueryClient {
  return new QueryClient({
    ...config,
    defaultOptions: {
      ...config.defaultOptions,
      queries: {
        ...QueryPresets.DEFAULT,
        retry: 1,
        ...config.defaultOptions?.queries,
      },
    },
  });
}
