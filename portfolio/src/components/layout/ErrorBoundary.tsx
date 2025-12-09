import React from "react";
import { useTranslation } from "react-i18next";

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

function ErrorFallback({ error }: { error?: Error }) {
  const { t } = useTranslation("pages");

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-8">
      <div className="max-w-md w-full space-y-4 text-center">
        <h1 className="text-2xl font-bold text-destructive">{t("error.title")}</h1>
        <p className="text-muted-foreground">
          {t("error.message")}
        </p>
        {error && (
          <pre className="text-xs text-left bg-muted p-4 rounded overflow-auto max-h-48">
            {error.message}
            {"\n"}
            {error.stack}
          </pre>
        )}
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          {t("error.reload")}
        </button>
      </div>
    </div>
  );
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
