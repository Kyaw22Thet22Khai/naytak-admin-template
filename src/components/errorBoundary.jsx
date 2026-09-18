import { Component } from "react";

/**
 * Catches render/lifecycle errors below it so a single broken widget shows a
 * recoverable panel instead of blanking the whole app.
 *
 * `resetKey` (pass the current pathname) clears the error on navigation, so a
 * page that failed does not stay failed after the user moves elsewhere.
 */
export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(error, info) {
    // Replace with your reporting service (Sentry, etc.).
    console.error("Unhandled error:", error, info.componentStack);
  }

  handleRetry = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const { fallback } = this.props;
    if (typeof fallback === "function") {
      return fallback({ error, retry: this.handleRetry });
    }
    return fallback ?? null;
  }
}
