/**
 * @file embedded-chat.tsx
 * @description Floating/collapsible chat panel for embedding on any page
 * 
 * This component provides a chat interface that can be placed alongside
 * page content, allowing users to interact with AI while browsing.
 * 
 * FEATURES:
 * - Collapsible panel (minimized/expanded states)
 * - Page-aware context (knows what page user is on)
 * - Contextual suggestions based on current page
 * - Armory Intelligence themed styling
 */

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageInput,
  MessageInputError,
  MessageInputSubmitButton,
  MessageInputTextarea,
  MessageInputToolbar,
} from "@/components/tambo/message-input";
import {
  MessageSuggestions,
  MessageSuggestionsList,
} from "@/components/tambo/message-suggestions";
import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import {
  ThreadContent,
  ThreadContentMessages,
} from "@/components/tambo/thread-content";
import { useTamboThread, useTamboThreadInput, type Suggestion } from "@tambo-ai/react";

export interface EmbeddedChatProps {
  /** The current page name for context */
  pageName?: string;
  /** Page-specific suggestions to show */
  suggestions?: Suggestion[];
  /** Position of the chat panel */
  position?: "right" | "bottom-right";
  /** Whether to start minimized */
  defaultMinimized?: boolean;
  /** Custom title for the chat header */
  title?: string;
  /** Additional context to pass to AI */
  pageContext?: Record<string, unknown>;
}

/**
 * Floating embedded chat component for page-level AI interaction
 */
export function EmbeddedChat({
  pageName = "page",
  suggestions,
  position = "right",
  defaultMinimized = true,
  title = "AI Assistant",
  pageContext,
}: EmbeddedChatProps) {
  const [isMinimized, setIsMinimized] = React.useState(defaultMinimized);
  const [hasNewMessage, setHasNewMessage] = React.useState(false);
  const { thread } = useTamboThread();
  const { isPending } = useTamboThreadInput();

  // Track new messages to show notification dot
  const messageCount = thread?.messages?.length ?? 0;
  const prevMessageCount = React.useRef(messageCount);
  
  React.useEffect(() => {
    if (messageCount > prevMessageCount.current && isMinimized) {
      setHasNewMessage(true);
    }
    prevMessageCount.current = messageCount;
  }, [messageCount, isMinimized]);

  // Clear notification when opened
  React.useEffect(() => {
    if (!isMinimized) {
      setHasNewMessage(false);
    }
  }, [isMinimized]);

  // Default suggestions based on page
  const defaultSuggestions: Suggestion[] = suggestions ?? [
    {
      id: `${pageName}-help`,
      title: "How can you help?",
      detailedSuggestion: `What can you help me with on this ${pageName} page?`,
      messageId: "help-query",
    },
    {
      id: `${pageName}-guide`,
      title: "Guide me",
      detailedSuggestion: `Give me a quick guide to using the ${pageName} features.`,
      messageId: "guide-query",
    },
  ];

  // Position styles
  const positionStyles = position === "right" 
    ? "right-0 top-0 h-full w-96"
    : "right-4 bottom-4 h-[500px] w-96 rounded-xl";

  return (
    <AnimatePresence mode="wait">
      {isMinimized ? (
        // Minimized state - floating button
        <motion.button
          key="minimized"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMinimized(false)}
          className={`fixed z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow ${
            position === "right" ? "right-4 bottom-4" : "right-4 bottom-4"
          }`}
        >
          <span className="text-xl">💬</span>
          <span className="font-medium">AI Chat</span>
          {hasNewMessage && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
          {isPending && (
            <span className="ml-1 w-2 h-2 bg-white rounded-full animate-pulse" />
          )}
        </motion.button>
      ) : (
        // Expanded state - full chat panel
        <motion.div
          key="expanded"
          initial={{ opacity: 0, x: position === "right" ? 100 : 0, y: position === "bottom-right" ? 100 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: position === "right" ? 100 : 0, y: position === "bottom-right" ? 100 : 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`fixed z-50 ${positionStyles} bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col overflow-hidden`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-800/50 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <div>
                <h3 className="text-white font-semibold text-sm">{title}</h3>
                <p className="text-xs text-slate-400">
                  {pageName.charAt(0).toUpperCase() + pageName.slice(1)} Context
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isPending && (
                <span className="text-xs text-orange-400 animate-pulse">
                  Thinking...
                </span>
              )}
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                title="Minimize chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Context indicator */}
          {pageContext && Object.keys(pageContext).length > 0 && (
            <div className="px-3 py-2 bg-orange-500/10 border-b border-orange-500/20">
              <p className="text-xs text-orange-400">
                📍 Context: {Object.keys(pageContext).slice(0, 3).join(", ")}
                {Object.keys(pageContext).length > 3 && ` +${Object.keys(pageContext).length - 3} more`}
              </p>
            </div>
          )}

          {/* Messages */}
          <ScrollableMessageContainer className="flex-1 p-3 overflow-y-auto">
            <ThreadContent variant="default">
              <ThreadContentMessages />
            </ThreadContent>
          </ScrollableMessageContainer>

          {/* Suggestions */}
          <MessageSuggestions initialSuggestions={defaultSuggestions}>
            <div className="px-3">
              <MessageSuggestionsList />
            </div>
          </MessageSuggestions>

          {/* Input */}
          <div className="p-3 border-t border-slate-700 bg-slate-800/50">
            <MessageInput>
              <MessageInputTextarea 
                placeholder={`Ask about ${pageName}...`}
                className="text-sm"
              />
              <MessageInputToolbar>
                <MessageInputSubmitButton />
              </MessageInputToolbar>
              <MessageInputError />
            </MessageInput>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Sidebar variant of embedded chat - fixed position on right side
 */
export function EmbeddedChatSidebar({
  pageName = "page",
  suggestions,
  title = "AI Assistant",
  pageContext,
}: Omit<EmbeddedChatProps, "position" | "defaultMinimized">) {
  const { thread } = useTamboThread();
  const { isPending } = useTamboThreadInput();

  const defaultSuggestions: Suggestion[] = suggestions ?? [
    {
      id: `${pageName}-help`,
      title: "How can you help?",
      detailedSuggestion: `What can you help me with on this ${pageName} page?`,
      messageId: "help-query",
    },
  ];

  return (
    <div className="w-80 h-full bg-slate-900 border-l border-slate-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-800/50 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <div>
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-xs text-slate-400">
              {pageName.charAt(0).toUpperCase() + pageName.slice(1)} Context
            </p>
          </div>
        </div>
        {isPending && (
          <span className="text-xs text-orange-400 animate-pulse">
            Thinking...
          </span>
        )}
      </div>

      {/* Context indicator */}
      {pageContext && Object.keys(pageContext).length > 0 && (
        <div className="px-3 py-2 bg-orange-500/10 border-b border-orange-500/20">
          <p className="text-xs text-orange-400">
            📍 Context: {Object.keys(pageContext).slice(0, 2).join(", ")}
          </p>
        </div>
      )}

      {/* Messages */}
      <ScrollableMessageContainer className="flex-1 p-3 overflow-y-auto">
        <ThreadContent variant="default">
          <ThreadContentMessages />
        </ThreadContent>
      </ScrollableMessageContainer>

      {/* Suggestions */}
      <MessageSuggestions initialSuggestions={defaultSuggestions}>
        <div className="px-3">
          <MessageSuggestionsList />
        </div>
      </MessageSuggestions>

      {/* Input */}
      <div className="p-3 border-t border-slate-700 bg-slate-800/50">
        <MessageInput>
          <MessageInputTextarea 
            placeholder={`Ask about ${pageName}...`}
            className="text-sm"
          />
          <MessageInputToolbar>
            <MessageInputSubmitButton />
          </MessageInputToolbar>
          <MessageInputError />
        </MessageInput>
      </div>
    </div>
  );
}

export default EmbeddedChat;
