"use client";

import { Component, type ReactNode } from "react";
import { Button } from "./button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("ArchiveLens error:", error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center gap-4 py-16 text-center" role="alert">
          <h2 className="font-serif text-2xl text-ink">Something went wrong.</h2>
          <p className="max-w-md text-sm text-ink-muted">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
