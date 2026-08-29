'use client';

import React, { useState, type ReactNode } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/core/button';
import { Link } from '@/components/core/link';
import { TooltipComponent, TooltipProvider } from '@/components/core/tooltip';
import { siteMetadata } from '@/lib/metadata/site-metadata';

export interface ApplicationShellNavItem {
  href: string;
  label: string;
  subtitle?: string;
  icon: LucideIcon;
  highlight?: boolean;
  exact?: boolean;
}

function isNavItemActive(
  pathname: string,
  item: ApplicationShellNavItem,
): boolean {
  return item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function ApplicationShellFooter({
  children,
  placement,
  collapsed = false,
}: {
  children: ReactNode;
  placement: 'sidebar' | 'content';
  collapsed?: boolean;
}) {
  return (
    <footer
      className={`flex shrink-0 items-center justify-center border-t border-border ${
        placement === 'sidebar'
          ? collapsed
            ? 'h-auto min-h-16 px-2 py-3'
            : 'h-16 px-3 sm:px-4'
          : 'min-h-16 px-4 py-3 text-center font-mono text-2xs uppercase text-ash'
      }`}
    >
      {children}
    </footer>
  );
}

export function ApplicationShell({
  children,
  brand,
  footer,
  navItems,
  accountNavItems = [],
  headerActions,
  planLabel,
  contentFooter,
}: {
  children: ReactNode;
  brand: { title: string; subtitle: string };
  footer?: ReactNode | ((props: { collapsed: boolean }) => ReactNode);
  navItems: ApplicationShellNavItem[];
  accountNavItems?: ApplicationShellNavItem[];
  headerActions?: ReactNode;
  planLabel?: string;
  contentFooter?: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const active =
    [...navItems, ...accountNavItems].find((item) =>
      isNavItemActive(pathname, item),
    ) ?? navItems[0];

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-background font-sans text-foreground antialiased selection:bg-vantor-blue/20 selection:text-white">
        {mobileOpen && (
          <button
            type="button"
            aria-label="Menüyü kapat"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-void-black/80 backdrop-blur-sm lg:hidden"
          />
        )}
        <aside
          className={`fixed bottom-0 left-0 top-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-[width,transform] duration-200 lg:translate-x-0 ${
            collapsed ? 'lg:w-20' : 'lg:w-72'
          } ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Sidebar Top Brand Header */}
          <div
            className={`flex h-16 items-center border-b border-border ${
              collapsed ? 'justify-center px-2' : 'justify-between px-5'
            }`}
          >
            <Link
              href="/"
              className={`flex min-w-0 items-center ${
                collapsed ? 'justify-center' : 'flex-1 gap-3'
              }`}
            >
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden border border-vantor-blue/40 bg-background font-mono font-black text-vantor-blue">
                <Image
                  src={siteMetadata.assets.logo}
                  alt={`${brand.title} brand mark`}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                  priority
                />
              </span>
              {!collapsed && (
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 font-mono text-sm font-black uppercase tracking-widest text-foreground">
                    <span className="truncate">{brand.title}</span>
                    {planLabel && (
                      <span className="shrink-0 border border-border bg-background px-1.5 py-0.5 text-micro text-muted-foreground">
                        {planLabel}
                      </span>
                    )}
                  </span>
                  <span
                    className="block truncate font-mono text-2xs text-muted-foreground"
                    title={brand.subtitle}
                  >
                    {brand.subtitle}
                  </span>
                </span>
              )}
            </Link>
            <Button
              onClick={() => setMobileOpen(false)}
              variant="ghost"
              size="icon"
              aria-label="Menüyü kapat"
              className="ml-auto h-8 w-8 shrink-0 p-1 text-ash hover:text-titanium lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Sidebar Navigation Items */}
          <nav
            className={`flex-1 space-y-1.5 font-mono text-xs uppercase tracking-wider ${
              collapsed ? 'p-2' : 'p-3'
            }`}
          >
            {navItems.map((item) => {
              const isActive = isNavItemActive(pathname, item);
              const Icon = item.icon;

              if (collapsed) {
                const collapsedClassName = `flex h-12 w-full items-center justify-center overflow-hidden border transition-all ${
                  isActive
                    ? 'cursor-default border-l-4 border-vantor-blue/40 border-l-vantor-blue bg-background text-foreground shadow-md'
                    : item.highlight
                      ? 'cursor-pointer border-border bg-background/40 text-vantor-blue hover:border-muted-foreground hover:text-foreground'
                      : 'cursor-pointer border-transparent text-muted-foreground hover:border-border hover:bg-background/60 hover:text-foreground'
                }`;

                const content = (
                  <Icon
                    className={`h-5 w-5 shrink-0 ${
                      isActive
                        ? 'text-vantor-blue'
                        : item.highlight
                          ? 'text-warning'
                          : 'text-muted-foreground'
                    }`}
                  />
                );

                return (
                  <TooltipComponent
                    key={item.href}
                    content={
                      <div>
                        <div className="font-bold">{item.label}</div>
                        {item.subtitle && (
                          <div className="text-2xs text-muted-foreground">
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    }
                    side="right"
                  >
                    {isActive ? (
                      <div
                        aria-current="page"
                        aria-disabled="true"
                        className={collapsedClassName}
                      >
                        {content}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={collapsedClassName}
                        aria-label={item.label}
                      >
                        {content}
                      </Link>
                    )}
                  </TooltipComponent>
                );
              }

              const expandedClassName = `flex h-14 w-full items-center justify-between gap-2 overflow-hidden border px-3.5 transition-all ${
                isActive
                  ? 'cursor-default border-l-4 border-vantor-blue/40 border-l-vantor-blue bg-background text-foreground shadow-md'
                  : item.highlight
                    ? 'cursor-pointer border-border bg-background/40 text-vantor-blue hover:border-muted-foreground hover:text-foreground'
                    : 'cursor-pointer border-transparent text-muted-foreground hover:border-border hover:bg-background/60 hover:text-foreground'
              }`;

              const content = (
                <>
                  <span className="flex min-w-0 flex-1 items-center gap-3">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive
                          ? 'text-vantor-blue'
                          : item.highlight
                            ? 'text-warning'
                            : 'text-muted-foreground'
                      }`}
                    />
                    <span className="min-w-0 flex-1 text-left">
                      <span
                        className="block truncate text-xs font-bold"
                        title={item.label}
                      >
                        {item.label}
                      </span>
                      {item.subtitle && (
                        <span
                          className="block truncate text-micro normal-case text-muted-foreground"
                          title={item.subtitle}
                        >
                          {item.subtitle}
                        </span>
                      )}
                    </span>
                  </span>
                  {isActive && (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-vantor-blue" />
                  )}
                </>
              );

              return isActive ? (
                <div
                  key={item.href}
                  aria-current="page"
                  aria-disabled="true"
                  className={expandedClassName}
                >
                  {content}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={expandedClassName}
                >
                  {content}
                </Link>
              );
            })}
          </nav>

          {footer && (
            <ApplicationShellFooter placement="sidebar" collapsed={collapsed}>
              {typeof footer === 'function'
                ? footer({ collapsed })
                : React.isValidElement(footer)
                  ? React.cloneElement(
                      footer as React.ReactElement<{ compact?: boolean }>,
                      { compact: collapsed },
                    )
                  : footer}
            </ApplicationShellFooter>
          )}
        </aside>

        <div
          className={`flex min-w-0 flex-1 flex-col transition-[padding] duration-200 ${
            collapsed ? 'lg:pl-20' : 'lg:pl-72'
          }`}
        >
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-card/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Button
                onClick={() => setMobileOpen(true)}
                variant="outline"
                size="icon"
                aria-label="Menüyü aç"
                className="shrink-0 border-border bg-background p-2 text-muted-foreground hover:text-foreground lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => setCollapsed((value) => !value)}
                variant="outline"
                size="icon"
                aria-label={collapsed ? 'Menüyü genişlet' : 'Menüyü daralt'}
                className="hidden shrink-0 border-border bg-background text-muted-foreground hover:text-foreground lg:inline-flex"
              >
                {collapsed ? (
                  <PanelLeftOpen className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </Button>
              <div className="min-w-0 flex-1">
                <h1
                  className="truncate font-mono text-sm font-black uppercase tracking-widest text-foreground"
                  title={active?.label}
                >
                  {active?.label}
                </h1>
                {active?.subtitle && (
                  <p
                    className="truncate text-xs text-muted-foreground"
                    title={active?.subtitle}
                  >
                    {active?.subtitle}
                  </p>
                )}
              </div>
            </div>
            {headerActions && (
              <div className="flex shrink-0 items-center gap-3 font-mono text-xs">
                {headerActions}
              </div>
            )}
          </header>
          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
          <ApplicationShellFooter placement="content">
            {contentFooter ?? 'Vantor © 2026'}
          </ApplicationShellFooter>
        </div>
      </div>
    </TooltipProvider>
  );
}
