'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { TooltipProvider } from '@/components/core/tooltip';
import { PageHeader } from '@/components/layout/page-header';
import { ApplicationShellFooter } from './application-shell-footer';
import { SidebarBrand } from './sidebar-brand';
import { SidebarNav } from './sidebar-nav';
import { ApplicationShellHeader } from './application-shell-header';
import { isNavItemActive } from './nav-utils';
import type { ApplicationShellProps } from './types';

export function ApplicationShell({
  children,
  brand,
  footer,
  navItems,
  accountNavItems = [],
  headerActions,
  planLabel,
  contentFooter,
  hidePageHeader = false,
  pageHeaderTitle,
  pageHeaderDescription,
  pageHeaderActions,
}: ApplicationShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const active =
    [...navItems, ...accountNavItems].find((item) =>
      isNavItemActive(pathname, item),
    ) ?? navItems[0];

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-background font-sans text-foreground antialiased selection:bg-tulpar-blue/20 selection:text-white">
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
          <SidebarBrand
            brand={brand}
            collapsed={collapsed}
            planLabel={planLabel}
            onCloseMobile={() => setMobileOpen(false)}
          />

          <SidebarNav
            navItems={navItems}
            pathname={pathname}
            collapsed={collapsed}
            onNavigate={() => setMobileOpen(false)}
          />

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
          <ApplicationShellHeader
            active={active}
            collapsed={collapsed}
            headerActions={headerActions}
            onOpenMobile={() => setMobileOpen(true)}
            onToggleCollapsed={() => setCollapsed((value) => !value)}
          />

          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              {active && !hidePageHeader && (
                <PageHeader
                  title={pageHeaderTitle ?? active.label}
                  description={pageHeaderDescription ?? active.subtitle}
                  actions={pageHeaderActions}
                />
              )}
              {children}
            </div>
          </main>

          <ApplicationShellFooter placement="content">
            {contentFooter ?? 'Tulpar © 2026'}
          </ApplicationShellFooter>
        </div>
      </div>
    </TooltipProvider>
  );
}
