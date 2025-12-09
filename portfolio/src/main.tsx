import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/typography.css";
import "./i18n/config/i18n"; // Initialize i18next before App
import App from "./App";
import { ThemeProvider } from "./theme";
import { I18nProvider } from "./i18n";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <I18nProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </I18nProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
