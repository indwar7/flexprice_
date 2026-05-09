import { useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Tooltip } from '@/components/atoms/Tooltip/Tooltip';

export interface SidebarNavItem {
  /** Stable id, used for React keys and the active selector. */
  id: string;
  label: string;
  icon: ReactNode;
  /** Optional href; if omitted, item renders as a button. */
  href?: string;
  /** Optional badge displayed next to the label (e.g. count). */
  badge?: ReactNode;
}

export interface SidebarNavSection {
  heading?: string;
  items: SidebarNavItem[];
}

export interface SidebarNavProps {
  /** Brand block (logo + name) at the top. */
  brand?: ReactNode;
  /** Item id currently active. */
  activeId?: string;
  /** Sections of nav items. */
  sections: SidebarNavSection[];
  /** Optional footer (user menu, settings link). */
  footer?: ReactNode;
  /** Callback when an item is clicked. */
  onItemClick?: (item: SidebarNavItem) => void;
  /** Whether collapsed by default. */
  defaultCollapsed?: boolean;
  className?: string;
}

/**
 * The main sidebar navigation rail. Collapses to icon-only mode (with
 * tooltips), supports multiple sections, and highlights the active route
 * with a brand-tinted accent.
 */
export function SidebarNav({
  brand,
  activeId,
  sections,
  footer,
  onItemClick,
  defaultCollapsed = false,
  className,
}: SidebarNavProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <aside
      className={cn(
        'h-full flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground',
        'transition-[width] duration-200',
        collapsed ? 'w-[60px]' : 'w-[232px]',
        className,
      )}
      aria-label="Main"
    >
      <div
        className={cn(
          'h-14 flex items-center border-b border-sidebar-border px-3 shrink-0',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {!collapsed && brand}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'h-7 w-7 inline-flex items-center justify-center rounded-md',
            'text-sidebar-muted hover:bg-accent hover:text-sidebar-foreground',
            'transition-colors',
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
        {sections.map((section, si) => (
          <div key={si} className={cn('mb-5 last:mb-0', collapsed && 'mb-2')}>
            {section.heading && !collapsed && (
              <div className="px-4 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-sidebar-muted">
                {section.heading}
              </div>
            )}
            <ul className={cn('flex flex-col gap-0.5', collapsed ? 'px-2' : 'px-2')}>
              {section.items.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  active={item.id === activeId}
                  collapsed={collapsed}
                  onClick={onItemClick}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {footer && (
        <div className={cn('border-t border-sidebar-border shrink-0', collapsed ? 'p-2' : 'p-3')}>
          {footer}
        </div>
      )}
    </aside>
  );
}

function NavItem({
  item,
  active,
  collapsed,
  onClick,
}: {
  item: SidebarNavItem;
  active: boolean;
  collapsed: boolean;
  onClick?: (item: SidebarNavItem) => void;
}) {
  const inner = (
    <>
      <span
        className={cn(
          'shrink-0 [&_svg]:h-4 [&_svg]:w-4 transition-colors',
          active ? 'text-brand' : 'text-sidebar-muted group-hover:text-sidebar-foreground',
        )}
      >
        {item.icon}
      </span>
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge}
        </>
      )}
    </>
  );

  const className = cn(
    'group flex items-center gap-2.5 h-8 rounded-md text-sm font-medium',
    'transition-colors relative',
    collapsed ? 'justify-center w-full' : 'px-2.5',
    active
      ? 'bg-sidebar-active-bg text-sidebar-active-fg'
      : 'text-sidebar-foreground/85 hover:bg-accent hover:text-sidebar-foreground',
  );

  const handle = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(item);
    }
  };

  const node = item.href ? (
    <a href={item.href} onClick={handle} className={className} aria-current={active ? 'page' : undefined}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={() => onClick?.(item)} className={className} aria-current={active ? 'page' : undefined}>
      {inner}
    </button>
  );

  return (
    <li>
      {collapsed ? (
        <Tooltip content={item.label} side="right">
          {node}
        </Tooltip>
      ) : (
        node
      )}
    </li>
  );
}
