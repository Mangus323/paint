import { useCallback, useEffect, useRef } from "react";

// TODO fix
type EventType<C> = C extends "document"
  ? Parameters<typeof document.addEventListener>[0]
  : Parameters<typeof window.addEventListener>[0];

export const useGlobalEventListener = <T, D>(
  context: "document" | "window",
  type: EventType<typeof context>,
  listener: (deps: D, ...args) => void,
  deps?: D,
  options?: any
) => {
  const localListener = useCallback((...args) => {
    listener(depsRef.current ? depsRef.current : ({} as unknown as D), ...args);
  }, []);
  const env = context === "document" ? document : window;
  const depsRef = useRef(deps);

  useEffect(() => {
    document.addEventListener(type, localListener, options);

    return () => {
      env.removeEventListener(type, localListener);
    };
  }, []);

  useEffect(() => {
    depsRef.current = deps;
  }, [deps]);
};
