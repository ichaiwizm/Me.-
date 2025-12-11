/**
 * GA4 Session Management
 * Tracks session state, message counts, timing, and user engagement
 */

import { GA4_CONFIG } from './config';
import type { PageId } from '../commands/types';

// ============================================================================
// TYPES
// ============================================================================

interface SessionData {
  id: string;
  startTime: number;
  lastActivity: number;
  messageCount: number;
  lastMessageTime: number;
  entryPage: PageId;
  chatUsed: boolean;
  visualModeUsed: boolean;
  themeChangeCount: number;
  visualModeChangeCount: number;
  scrollDepthReached: number[];
  pagesVisited: PageId[];
  isNewUser: boolean;
  chatOpenTime: number | null;
  chatMessagesWhileOpen: number;
}

interface UserData {
  firstVisit: number;
  totalSessions: number;
  featuresUsed: string[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SESSION_KEY = 'ga4_session';
const USER_KEY = 'ga4_user';

// ============================================================================
// SESSION MANAGER CLASS
// ============================================================================

class GA4SessionManager {
  private session: SessionData | null = null;
  private user: UserData | null = null;

  constructor() {
    this.initUser();
    this.initSession();
  }

  // --------------------------------------------------------------------------
  // INITIALIZATION
  // --------------------------------------------------------------------------

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  private initUser(): void {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        this.user = JSON.parse(stored);
      } else {
        this.user = {
          firstVisit: Date.now(),
          totalSessions: 0,
          featuresUsed: [],
        };
        this.saveUser();
      }
    } catch {
      this.user = {
        firstVisit: Date.now(),
        totalSessions: 0,
        featuresUsed: [],
      };
    }
  }

  private initSession(): void {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      const now = Date.now();

      if (stored) {
        const parsed = JSON.parse(stored) as SessionData;
        const timeSinceLastActivity = now - parsed.lastActivity;
        const timeoutMs = GA4_CONFIG.SESSION_TIMEOUT_MINUTES * 60 * 1000;

        // Check if session is still valid
        if (timeSinceLastActivity < timeoutMs) {
          this.session = parsed;
          this.updateActivity();
          return;
        }
      }

      // Create new session
      this.createNewSession();
    } catch {
      this.createNewSession();
    }
  }

  private createNewSession(): void {
    const isNewUser = !this.user || this.user.totalSessions === 0;

    // Determine entry page from URL
    const path = window.location.pathname;
    const entryPage: PageId = this.pathToPageId(path);

    this.session = {
      id: this.generateId(),
      startTime: Date.now(),
      lastActivity: Date.now(),
      messageCount: 0,
      lastMessageTime: 0,
      entryPage,
      chatUsed: false,
      visualModeUsed: false,
      themeChangeCount: 0,
      visualModeChangeCount: 0,
      scrollDepthReached: [],
      pagesVisited: [entryPage],
      isNewUser,
      chatOpenTime: null,
      chatMessagesWhileOpen: 0,
    };

    // Increment user session count
    if (this.user) {
      this.user.totalSessions++;
      this.saveUser();
    }

    this.saveSession();
  }

  private pathToPageId(path: string): PageId {
    const cleanPath = path.replace(/^\/|\/$/g, '') || 'accueil';
    const pageMap: Record<string, PageId> = {
      '': 'accueil',
      'accueil': 'accueil',
      'projets': 'projets',
      'competences': 'competences',
      'a-propos': 'a-propos',
      'contact': 'contact',
    };
    return pageMap[cleanPath] || 'accueil';
  }

  // --------------------------------------------------------------------------
  // PERSISTENCE
  // --------------------------------------------------------------------------

  private saveSession(): void {
    if (!this.session) return;
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(this.session));
    } catch {
      // Storage might be full or disabled
    }
  }

  private saveUser(): void {
    if (!this.user) return;
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(this.user));
    } catch {
      // Storage might be full or disabled
    }
  }

  // --------------------------------------------------------------------------
  // ACTIVITY TRACKING
  // --------------------------------------------------------------------------

  updateActivity(): void {
    if (this.session) {
      this.session.lastActivity = Date.now();
      this.saveSession();
    }
  }

  // --------------------------------------------------------------------------
  // SESSION DATA GETTERS
  // --------------------------------------------------------------------------

  getSessionId(): string {
    return this.session?.id || '';
  }

  getTimeSinceSessionStart(): number {
    return this.session ? Date.now() - this.session.startTime : 0;
  }

  getTimeSinceLastMessage(): number {
    if (!this.session || this.session.lastMessageTime === 0) return 0;
    return Date.now() - this.session.lastMessageTime;
  }

  getMessageCount(): number {
    return this.session?.messageCount || 0;
  }

  getEntryPage(): PageId {
    return this.session?.entryPage || 'accueil';
  }

  isNewUser(): boolean {
    return this.session?.isNewUser ?? true;
  }

  isReturningUser(): boolean {
    return !this.isNewUser();
  }

  getSessionNumber(): number {
    return this.user?.totalSessions || 1;
  }

  // --------------------------------------------------------------------------
  // MESSAGE TRACKING
  // --------------------------------------------------------------------------

  incrementMessageCount(): number {
    if (this.session) {
      this.session.messageCount++;
      this.session.lastMessageTime = Date.now();
      this.session.chatMessagesWhileOpen++;
      this.saveSession();
      return this.session.messageCount;
    }
    return 0;
  }

  // --------------------------------------------------------------------------
  // CHAT PANEL TRACKING
  // --------------------------------------------------------------------------

  markChatOpened(): void {
    if (this.session) {
      this.session.chatUsed = true;
      this.session.chatOpenTime = Date.now();
      this.session.chatMessagesWhileOpen = 0;
      this.saveSession();
    }
  }

  markChatClosed(): { timeOpenMs: number; messagesWhileOpen: number } {
    if (this.session && this.session.chatOpenTime) {
      const timeOpenMs = Date.now() - this.session.chatOpenTime;
      const messagesWhileOpen = this.session.chatMessagesWhileOpen;
      this.session.chatOpenTime = null;
      this.session.chatMessagesWhileOpen = 0;
      this.saveSession();
      return { timeOpenMs, messagesWhileOpen };
    }
    return { timeOpenMs: 0, messagesWhileOpen: 0 };
  }

  wasChatUsed(): boolean {
    return this.session?.chatUsed ?? false;
  }

  // --------------------------------------------------------------------------
  // VISUAL MODE TRACKING
  // --------------------------------------------------------------------------

  markVisualModeUsed(): void {
    if (this.session && !this.session.visualModeUsed) {
      this.session.visualModeUsed = true;
      this.saveSession();
    }
  }

  incrementVisualModeChangeCount(): number {
    if (this.session) {
      this.session.visualModeChangeCount++;
      this.saveSession();
      return this.session.visualModeChangeCount;
    }
    return 0;
  }

  getVisualModeChangeCount(): number {
    return this.session?.visualModeChangeCount || 0;
  }

  // --------------------------------------------------------------------------
  // THEME TRACKING
  // --------------------------------------------------------------------------

  incrementThemeChangeCount(): number {
    if (this.session) {
      this.session.themeChangeCount++;
      this.saveSession();
      return this.session.themeChangeCount;
    }
    return 0;
  }

  getThemeChangeCount(): number {
    return this.session?.themeChangeCount || 0;
  }

  // --------------------------------------------------------------------------
  // SCROLL TRACKING
  // --------------------------------------------------------------------------

  hasReachedScrollDepth(threshold: number): boolean {
    return this.session?.scrollDepthReached.includes(threshold) ?? false;
  }

  markScrollDepthReached(threshold: number): boolean {
    if (this.session && !this.session.scrollDepthReached.includes(threshold)) {
      this.session.scrollDepthReached.push(threshold);
      this.saveSession();
      return true; // First time reaching this threshold
    }
    return false;
  }

  // --------------------------------------------------------------------------
  // PAGE TRACKING
  // --------------------------------------------------------------------------

  markPageVisited(pageId: PageId): boolean {
    if (this.session && !this.session.pagesVisited.includes(pageId)) {
      this.session.pagesVisited.push(pageId);
      this.saveSession();
      return true; // First visit to this page in session
    }
    return false;
  }

  getPagesVisited(): PageId[] {
    return this.session?.pagesVisited || [];
  }

  // --------------------------------------------------------------------------
  // FEATURE ADOPTION TRACKING
  // --------------------------------------------------------------------------

  markFeatureUsed(featureName: string): boolean {
    if (this.user) {
      const isFirstUse = !this.user.featuresUsed.includes(featureName);
      if (isFirstUse) {
        this.user.featuresUsed.push(featureName);
        this.saveUser();
      }
      return isFirstUse;
    }
    return false;
  }

  hasUsedFeature(featureName: string): boolean {
    return this.user?.featuresUsed.includes(featureName) ?? false;
  }

  // --------------------------------------------------------------------------
  // DEBUG
  // --------------------------------------------------------------------------

  getDebugInfo(): object {
    return {
      session: this.session,
      user: this.user,
    };
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const ga4Session = new GA4SessionManager();
