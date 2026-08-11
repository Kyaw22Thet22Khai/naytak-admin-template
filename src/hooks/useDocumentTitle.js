import { useEffect } from "react";
import { APP_NAME } from "../constants/app";

/** Sets the browser tab title, prefixed with the app name. */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME;
  }, [title]);
}
