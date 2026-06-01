"use client";

import { useState, useCallback } from "react";

export interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggle: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}

/**
 * Manages sidebar collapsed/expanded state and mobile open/close state.
 */
export function useSidebar(): SidebarState {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggle = useCallback(() => setIsCollapsed((c) => !c), []);
  const toggleMobile = useCallback(() => setIsMobileOpen((o) => !o), []);
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  return { isCollapsed, isMobileOpen, toggle, toggleMobile, closeMobile };
}
