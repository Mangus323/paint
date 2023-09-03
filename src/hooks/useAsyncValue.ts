import { useEffect, useState } from "react";

export const useAsyncValue = <T>(value: T) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return localValue;
};
