"use client";

import * as React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="max-w-md w-full bg-card border border-destructive/30 rounded-2xl p-8 text-center shadow-2xl glass-panel flex flex-col items-center justify-center gap-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
            <span className="material-symbols-outlined text-3xl">error</span>
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-foreground mb-3">Render Error</h2>
            <p className="text-xs text-muted-foreground font-sans max-w-xs leading-relaxed mx-auto">
              Something went wrong while displaying this page. The EPUB HTML content might be malformed or contain incompatible tags.
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 border border-border/30 rounded text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          >
            Try reloading page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
