import React, {
  JSX,
  ReactNode,
  createContext,
  useEffect,
  useState
} from "react";

export const MousePositionContext = createContext({ x: 0, y: 0 });

interface MouseListenerProps {
  children: ReactNode;
}

export const MouseListener = (props: MouseListenerProps): JSX.Element => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <>
      <MousePositionContext.Provider value={position}>
        {props.children}
      </MousePositionContext.Provider>
    </>
  );
};
