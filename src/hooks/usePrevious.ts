import { useEffect, useRef } from "react";

function usePrevious<T>(value) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default usePrevious;
