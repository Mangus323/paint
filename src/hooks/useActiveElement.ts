import { useContext, useEffect, useRef } from "react";
import { ActiveElementContext } from "@/components/HOC/ActiveElementProvider";
import { setToast } from "@/redux/slices/browser/reducer";
import { place, placeAndEdit, redo, undo } from "@/redux/slices/canvas/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { IElement } from "@/types/canvas";

export const useActiveElement = () => {
  const { element: activeElement, setElement } =
    useContext(ActiveElementContext);
  const { elements, history } = useAppSelector(state => state.canvas);
  const dispatch = useAppDispatch();

  const activeElementRef = useRef(activeElement);
  const elementsRef = useRef(elements);
  const historyRef = useRef(history);

  const setNewActiveElement = (element: IElement) => {
    if (activeElementRef.current) dispatch(place(activeElementRef.current));
    dispatch(placeAndEdit(element));
    setElement(element);
  };

  const setActiveElement = (element: IElement | null) => {
    const activeElement = activeElementRef.current;
    if (!element && activeElement) {
      dispatch(place(activeElement));
      setElement(null);
    }
    if (element && activeElement) {
      setElement(element);
    }
    if (!activeElement && element) {
      dispatch(placeAndEdit(element));
      setElement(element);
    }
  };

  const activeElementUndo = () => {
    const current = elementsRef.current;
    const last = current[current.length - 1] || null;
    dispatch(undo(activeElementRef.current));
    setElement(last);
    if (!last && !activeElementRef.current) return;
    dispatch(setToast("undo"));
  };

  const activeElementRedo = () => {
    const current = historyRef.current;
    const last = current[current.length - 1] || null;
    let element = activeElementRef.current;

    if (!last) return;
    if (element) dispatch(place(element));
    setElement(last);
    dispatch(redo());
    dispatch(setToast("redo"));
  };

  useEffect(() => {
    activeElementRef.current = activeElement;
  }, [activeElement]);

  useEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  return {
    activeElement,
    setActiveElement,
    setNewActiveElement,
    undo: activeElementUndo,
    redo: activeElementRedo
  };
};
