import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("[ErrorBoundary caught error]:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
          <p className="text-xs text-[var(--text-muted)]">
            Komponen interaktif 3D tidak tersedia di lingkungan ini.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
