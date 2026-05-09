import { describe, expect, it } from 'vitest';
import { QueryPresets, buildQueryClient, createQueryConfig } from './queryConfig';

describe('createQueryConfig', () => {
  it('uses the DEFAULT preset when no name is given', () => {
    expect(createQueryConfig()).toEqual(QueryPresets.DEFAULT);
  });

  it('returns the chosen preset', () => {
    expect(createQueryConfig('REALTIME')).toEqual(QueryPresets.REALTIME);
  });

  it('lets a call site override one field while keeping the rest', () => {
    const cfg = createQueryConfig('STATIC', { staleTime: 0 });
    expect(cfg.staleTime).toBe(0);
    expect(cfg.gcTime).toBe(QueryPresets.STATIC.gcTime);
  });
});

describe('buildQueryClient', () => {
  it('applies the global default cache policy to new queries', () => {
    const qc = buildQueryClient();
    const defaults = qc.getDefaultOptions().queries;
    expect(defaults?.staleTime).toBe(QueryPresets.DEFAULT.staleTime);
    expect(defaults?.gcTime).toBe(QueryPresets.DEFAULT.gcTime);
  });

  it('lets the caller override defaults at the client level', () => {
    const qc = buildQueryClient({
      defaultOptions: { queries: { staleTime: 0 } },
    });
    expect(qc.getDefaultOptions().queries?.staleTime).toBe(0);
  });
});
