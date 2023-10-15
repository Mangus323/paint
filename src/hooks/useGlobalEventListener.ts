import { useCallback, useEffect, useRef } from "react";

type EventType<C> = C extends "document"
  ? keyof DocumentEventMap
  : keyof WindowEventMap;

export const useGlobalEventListener = <E extends "document" | "window", D>(
  context: E,
  type: EventType<E>,
  listener: (deps: D, ...args) => void,
  deps?: D,
  options?: any
) => {
  const localListener = useCallback((...args) => {
    if (depsRef.current) listener(depsRef.current, ...args);
  }, []);
  const env = context === "document" ? document : window;
  const depsRef = useRef(deps);

  useEffect(() => {
    env.addEventListener(type, localListener, options);

    return () => {
      env.removeEventListener(type, localListener);
    };
  }, []);

  useEffect(() => {
    depsRef.current = deps;
  }, [deps]);
};
