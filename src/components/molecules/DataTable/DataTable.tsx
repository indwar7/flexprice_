import {
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/cn';
import { LoadingState } from '@/components/atoms/Spinner/Spinner';

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  /** Column id being sorted. */
  id: string;
  direction: SortDirection;
}

export interface DataTableColumn<Row> {
  /** Stable identifier — used for sort state and React keys. */
  id: string;
  /** Header label. */
  header: ReactNode;
  /** Cell renderer. */
  cell: (row: Row, index: number) => ReactNode;
  /** Optional explicit width (CSS units) or grid track size. */
  width?: string;
  /** Tailwind class for the cell — handy for alignment. */
  align?: 'left' | 'right' | 'center';
  /** Make this column sortable; when true, header becomes a button. */
  sortable?: boolean;
}

export interface DataTablePagination {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export interface DataTableProps<Row> {
  rows: Row[];
  columns: DataTableColumn<Row>[];
  /** Stable row id — used for keys. */
  getRowId: (row: Row, index: number) => string;
  /** Show a loading skeleton instead of rows. */
  loading?: boolean;
  /** Custom empty state rendered when `rows` is empty. */
  emptyState?: ReactNode;
  /** Currently sorted column. */
  sort?: SortState;
  onSortChange?: (next: SortState | undefined) => void;
  /**
   * Enable row virtualisation with @tanstack/react-virtual. Use for
   * 1k+ rows. Pagination is hidden in virtual mode.
   */
  virtual?: {
    enabled: boolean;
    /** Approximate row height in px; supports dynamic measurement via observer. */
    estimateRowHeight?: number;
    /** Height of the scroll container, e.g. "560px" or "70vh". */
    containerHeight?: string;
    /** Extra rows rendered above/below the viewport. */
    overscan?: number;
  };
  pagination?: DataTablePagination;
  /** Click handler for entire row. */
  onRowClick?: (row: Row, index: number) => void;
  className?: string;
  /** Compact density (smaller paddings). */
  density?: 'comfortable' | 'compact';
}

/**
 * The workhorse table for FlexPrice list pages. Supports sortable columns,
 * loading skeletons, empty states, pagination, and (for the Customers /
 * Invoices pages) row virtualisation via `@tanstack/react-virtual` so that
 * tens of thousands of rows can scroll smoothly.
 */
export function DataTable<Row>({
  rows,
  columns,
  getRowId,
  loading = false,
  emptyState,
  sort,
  onSortChange,
  virtual,
  pagination,
  onRowClick,
  className,
  density = 'comfortable',
}: DataTableProps<Row>) {
  const gridTemplate = useMemo(
    () =>
      columns
        .map((c) => c.width ?? 'minmax(0, 1fr)')
        .join(' '),
    [columns],
  );

  const padY = density === 'compact' ? 'py-2' : 'py-3';
  const padX = 'px-4';

  function toggleSort(id: string) {
    if (!onSortChange) return;
    if (sort?.id !== id) onSortChange({ id, direction: 'asc' });
    else if (sort.direction === 'asc') onSortChange({ id, direction: 'desc' });
    else onSortChange(undefined);
  }

  const header = (
    <div
      role="row"
      className={cn(
        'grid items-center bg-muted/40 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.06em]',
      )}
      style={{ gridTemplateColumns: gridTemplate }}
    >
      {columns.map((col) => {
        const isSorted = sort?.id === col.id;
        const Icon =
          isSorted && sort.direction === 'asc'
            ? ArrowUp
            : isSorted && sort.direction === 'desc'
              ? ArrowDown
              : ChevronsUpDown;
        return (
          <div
            key={col.id}
            role="columnheader"
            className={cn(padX, padY, alignClass(col.align))}
          >
            {col.sortable ? (
              <button
                type="button"
                onClick={() => toggleSort(col.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 hover:text-foreground transition-colors',
                  isSorted && 'text-foreground',
                )}
              >
                {col.header}
                <Icon className="h-3 w-3" aria-hidden />
              </button>
            ) : (
              col.header
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      className={cn(
        'rounded-md border border-border bg-card overflow-hidden text-sm shadow-xs',
        className,
      )}
    >
      <div role="table">
        {header}
        {loading ? (
          <SkeletonBody columns={columns} gridTemplate={gridTemplate} />
        ) : rows.length === 0 ? (
          <div className="p-6">{emptyState ?? <DefaultEmpty />}</div>
        ) : virtual?.enabled ? (
          <VirtualBody
            rows={rows}
            columns={columns}
            gridTemplate={gridTemplate}
            getRowId={getRowId}
            onRowClick={onRowClick}
            estimateRowHeight={virtual.estimateRowHeight ?? (density === 'compact' ? 40 : 52)}
            containerHeight={virtual.containerHeight ?? '560px'}
            overscan={virtual.overscan ?? 10}
            padX={padX}
            padY={padY}
          />
        ) : (
          <PlainBody
            rows={rows}
            columns={columns}
            gridTemplate={gridTemplate}
            getRowId={getRowId}
            onRowClick={onRowClick}
            padX={padX}
            padY={padY}
          />
        )}
      </div>
      {pagination && !virtual?.enabled && rows.length > 0 && (
        <Pagination {...pagination} />
      )}
    </div>
  );
}

function alignClass(align?: 'left' | 'right' | 'center') {
  if (align === 'right') return 'text-right justify-end';
  if (align === 'center') return 'text-center justify-center';
  return 'text-left';
}

function PlainBody<Row>({
  rows,
  columns,
  gridTemplate,
  getRowId,
  onRowClick,
  padX,
  padY,
}: {
  rows: Row[];
  columns: DataTableColumn<Row>[];
  gridTemplate: string;
  getRowId: (row: Row, index: number) => string;
  onRowClick?: (row: Row, index: number) => void;
  padX: string;
  padY: string;
}) {
  return (
    <div role="rowgroup">
      {rows.map((row, idx) => (
        <RowEl
          key={getRowId(row, idx)}
          row={row}
          idx={idx}
          columns={columns}
          gridTemplate={gridTemplate}
          onRowClick={onRowClick}
          padX={padX}
          padY={padY}
        />
      ))}
    </div>
  );
}

function VirtualBody<Row>({
  rows,
  columns,
  gridTemplate,
  getRowId,
  onRowClick,
  estimateRowHeight,
  containerHeight,
  overscan,
  padX,
  padY,
}: {
  rows: Row[];
  columns: DataTableColumn<Row>[];
  gridTemplate: string;
  getRowId: (row: Row, index: number) => string;
  onRowClick?: (row: Row, index: number) => void;
  estimateRowHeight: number;
  containerHeight: string;
  overscan: number;
  padX: string;
  padY: string;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateRowHeight,
    overscan,
  });

  return (
    <div
      ref={parentRef}
      className="overflow-auto scrollbar-thin"
      style={{ height: containerHeight }}
      role="rowgroup"
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((vi) => {
          const row = rows[vi.index];
          return (
            <div
              key={getRowId(row, vi.index)}
              ref={virtualizer.measureElement}
              data-index={vi.index}
              style={
                {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  transform: `translateY(${vi.start}px)`,
                } as CSSProperties
              }
            >
              <RowEl
                row={row}
                idx={vi.index}
                columns={columns}
                gridTemplate={gridTemplate}
                onRowClick={onRowClick}
                padX={padX}
                padY={padY}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RowEl<Row>({
  row,
  idx,
  columns,
  gridTemplate,
  onRowClick,
  padX,
  padY,
}: {
  row: Row;
  idx: number;
  columns: DataTableColumn<Row>[];
  gridTemplate: string;
  onRowClick?: (row: Row, index: number) => void;
  padX: string;
  padY: string;
}) {
  return (
    <div
      role="row"
      onClick={onRowClick ? () => onRowClick(row, idx) : undefined}
      className={cn(
        'grid items-center border-b border-border last:border-b-0 transition-colors',
        onRowClick && 'cursor-pointer hover:bg-muted/40',
      )}
      style={{ gridTemplateColumns: gridTemplate }}
    >
      {columns.map((col) => (
        <div
          key={col.id}
          role="cell"
          className={cn(padX, padY, alignClass(col.align), 'truncate')}
        >
          {col.cell(row, idx)}
        </div>
      ))}
    </div>
  );
}

function SkeletonBody<Row>({
  columns,
  gridTemplate,
}: {
  columns: DataTableColumn<Row>[];
  gridTemplate: string;
}) {
  return (
    <div role="rowgroup">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          role="row"
          className="grid items-center border-b border-border last:border-b-0"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {columns.map((col) => (
            <div key={col.id} className="px-4 py-3">
              <div className="h-3 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function DefaultEmpty() {
  return (
    <div className="py-10 text-center text-sm text-muted-foreground">
      No results to display.
    </div>
  );
}

function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: DataTablePagination) {
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30 text-xs text-muted-foreground">
      <span className="tabular-nums">
        Showing <span className="text-foreground font-medium">{start}</span>–
        <span className="text-foreground font-medium">{end}</span> of{' '}
        <span className="text-foreground font-medium">{total}</span>
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
          className="h-7 w-7 inline-flex items-center justify-center rounded border border-input hover:bg-accent disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        <span className="px-2 tabular-nums">
          Page <span className="text-foreground">{page}</span> of{' '}
          <span className="text-foreground">{lastPage}</span>
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(lastPage, page + 1))}
          disabled={page >= lastPage}
          aria-label="Next page"
          className="h-7 w-7 inline-flex items-center justify-center rounded border border-input hover:bg-accent disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

/** Dedicated full-block loading shell for tables — exported for stories. */
export function DataTableLoading() {
  return <LoadingState label="Loading…" />;
}
