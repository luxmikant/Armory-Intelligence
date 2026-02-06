"use client";

/**
 * @file client-only.tsx
 * @description Wrapper component that only renders children after client-side mount.
 * Prevents SSR/prerendering issues with context providers that require browser APIs.
 */

import { useState, useEffect, type ReactNode } from "react";

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ClientOnly - wrapper that defers rendering until client-side mount.
 * Use this around TamboProvider and other components that use hooks
 * requiring browser-only context providers.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
