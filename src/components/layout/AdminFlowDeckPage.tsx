'use client';

import { ReactNode } from 'react';
import { FlowDeckTablet } from './FlowDeckTablet';
import { FlowDeckNavigation } from '../navigation/FlowDeckNavigation';
import { FTCLogo } from '../branding/FTCLogo';

interface AdminFlowDeckPageProps {
  /** Main content */
  children: ReactNode;
  /** Page title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Show home button */
  showHome?: boolean;
  /** Show back button */
  showBack?: boolean;
  /** Back destination */
  backTo?: string;
  /** Right-side action buttons */
  rightActions?: ReactNode;
  /** Show FTC logo */
  showLogo?: boolean;
}

/**
 * Admin FlowDeck Page Wrapper
 * Provides consistent page structure for all admin pages
 * Uses same navigation system as presentation pages for uniformity
 *
 * Usage:
 * <AdminFlowDeckPage
 *   title="Products"
 *   subtitle="Manage all products"
 *   showHome
 *   showBack
 *   backTo="/admin"
 * >
 *   <YourContent />
 * </AdminFlowDeckPage>
 */
export function AdminFlowDeckPage({
  children,
  title,
  subtitle,
  showHome = true,
  showBack = true,
  backTo,
  rightActions,
  showLogo = true,
}: AdminFlowDeckPageProps) {
  return (
    <FlowDeckTablet backgroundColor="bg-white">
      {/* Same overlay navigation as presentation pages */}
      <FlowDeckNavigation
        showHome={showHome}
        showBack={showBack}
        backTo={backTo}
      />

      {/* Admin Header - Inside content area */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-ftc-admin-primary to-ftc-admin-secondary px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-md text-white">{title}</h1>
            {subtitle && (
              <p className="text-body-md text-white/90 mt-1">{subtitle}</p>
            )}
          </div>
          {rightActions && (
            <div className="flex items-center gap-3">
              {rightActions}
            </div>
          )}
        </div>
      </div>

      {/* Main Content - With top padding to account for header */}
      <div className="pt-28 pb-8 px-8 h-full overflow-y-auto">
        {children}
      </div>

      {/* FTC Logo - Bottom Left (same as products section) */}
      {showLogo && (
        <FTCLogo position="bottom-left" size="sm" />
      )}
    </FlowDeckTablet>
  );
}
