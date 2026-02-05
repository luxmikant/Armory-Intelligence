"use client";

/**
 * @file page-context-helper.tsx
 * @description Component that provides page-specific context to Tambo AI
 * Uses useTamboContextHelpers to add context that's included with every message
 */

import { useEffect } from "react";
import { useTamboContextHelpers } from "@tambo-ai/react";

interface PageContextHelperProps {
  /** Unique key for this context helper (e.g., "catalogPage", "ballisticsPage") */
  contextKey: string;
  /** Context data to include with every message */
  context: Record<string, unknown>;
}

/**
 * PageContextHelper - Registers page-specific context with Tambo
 * 
 * This component uses useTamboContextHelpers to register a context helper
 * that automatically includes the provided context with every message sent
 * to the AI. The context is removed when the component unmounts.
 * 
 * @example
 * ```tsx
 * <TamboProvider>
 *   <PageContextHelper 
 *     contextKey="catalog"
 *     context={{
 *       page: "catalog",
 *       totalFirearms: 47,
 *       activeFilters: { types: ["Pistol"] },
 *     }}
 *   />
 *   <EmbeddedChat />
 * </TamboProvider>
 * ```
 */
export function PageContextHelper({ contextKey, context }: PageContextHelperProps) {
  const { addContextHelper, removeContextHelper } = useTamboContextHelpers();

  useEffect(() => {
    // Add context helper that returns the current context
    addContextHelper(contextKey, () => context);

    // Cleanup: remove context helper when component unmounts or context changes
    return () => {
      removeContextHelper(contextKey);
    };
  }, [contextKey, context, addContextHelper, removeContextHelper]);

  // This component doesn't render anything
  return null;
}

/**
 * UserPreferencesContext - Global user preferences context helper
 * 
 * Tracks user's expertise level, preferred calibers, state, etc.
 * Helps AI personalize responses based on user preferences.
 */
interface UserPreferencesContextProps {
  expertiseLevel?: "beginner" | "intermediate" | "advanced" | "expert";
  preferredCalibers?: string[];
  homeState?: string;
  primaryUseCase?: "home-defense" | "concealed-carry" | "sport" | "hunting" | "collection";
}

export function UserPreferencesContext(props: UserPreferencesContextProps) {
  return (
    <PageContextHelper 
      contextKey="userPreferences"
      context={{
        ...props,
        preferencesSaved: Object.keys(props).length > 0,
      }}
    />
  );
}
