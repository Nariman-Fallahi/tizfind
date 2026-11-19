import { useEffect, useRef } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Routes, Route } from "react-router";
import { PageTransition } from "@/components/animate-ui/components/page-transition";
import AppLauncher from "./pages/launcher";
import Dashboard from "./pages/dashboard";
import "./app.css";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const win = getCurrentWindow();

    const unlistenPromise = win.onFocusChanged(({ payload: focused }) => {
      if (focused) inputRef.current?.focus();
    });

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") win.hide();
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      unlistenPromise.then((un) => un());
    };
  }, []);

  return (
    <PageTransition effect="push" className="rounded-xl bg-popover">
      <Routes>
        <Route path="/" element={<AppLauncher />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </PageTransition>
  );
}
export default App;
