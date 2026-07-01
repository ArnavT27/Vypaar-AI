import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Options {
  onToggleCommandPalette: () => void;
  onToggleHelp: () => void;
  onCloseModals?: () => void;
}

export function useKeyboardShortcuts({
  onToggleCommandPalette,
  onToggleHelp,
  onCloseModals,
}: Options) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input, textarea or contenteditable element
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        // Allow escape key to blur the input or close modals even if focused
        if (e.key === "Escape") {
          if (activeEl instanceof HTMLElement) activeEl.blur();
          if (onCloseModals) onCloseModals();
        }
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const isMetaOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Escape -> close modals
      if (e.key === "Escape") {
        if (onCloseModals) onCloseModals();
      }

      if (isMetaOrCtrl) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            navigate("/billing");
            break;
          case "i":
            e.preventDefault();
            navigate("/inventory");
            break;
          case "d":
            e.preventDefault();
            navigate("/");
            break;
          case "k":
            e.preventDefault();
            onToggleCommandPalette();
            break;
          case "/":
            e.preventDefault();
            onToggleHelp();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, onToggleCommandPalette, onToggleHelp, onCloseModals]);
}
