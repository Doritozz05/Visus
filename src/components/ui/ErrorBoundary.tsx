"use client";

import * as React from "react";
import { AlertCard } from "./AlertCard";

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
        <div className="min-h-[400px] w-full flex items-center justify-center p-4">
          <AlertCard
            title="Render Error"
            description="Something went wrong while displaying this page. The EPUB HTML content might be malformed or contain incompatible tags."
            variant="error"
            action={{
              label: "Try reloading page",
              onClick: () => this.setState({ hasError: false, error: null }),
            }}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
