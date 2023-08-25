import React, {
  JSX,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useState
} from "react";
import { Button } from "@/components/elements/Button/Button";
import usePrevious from "@/hooks/usePrevious";
import { edit } from "@/redux/slices/canvas/reducer";
import { useActiveElement } from "@/redux/slices/canvas/selectors";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import s from "./index.module.scss";

export const ActiveElementEdit = (): JSX.Element => {
  const { activeElementMeta } = useAppSelector(
    state => state.editActiveElement
  );
  const { isActiveElement, activeElement } = useActiveElement();
  const dispatch = useAppDispatch();
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const previousLastPosition = usePrevious<typeof lastPosition>(lastPosition);
  const [renderTime, setRenderTime] = useState(0);
  const [action, setAction] = useState<string | null>(null);

  const onMouseDownDrag = (e: ReactMouseEvent<HTMLButtonElement>) => {
    setLastPosition({ x: e.clientX, y: e.clientY });
    setAction("drag");
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUpDrag);
  };

  const onMouseDownRotation = (e: ReactMouseEvent<HTMLButtonElement>) => {
    setLastPosition({ x: e.clientX, y: e.clientY });
    setAction("rotation");
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUpRotation);
  };

  const onMouseMove = (e: MouseEvent) => {
    setLastPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  const onMouseUpDrag = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUpDrag);
    setAction(null);
    setRenderTime(1);
  };

  const onMouseUpRotation = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUpRotation);
    setAction(null);
    setRenderTime(1);
  };

  useEffect(() => {
    if (renderTime < 2) {
      setRenderTime(renderTime + 1);
      return;
    }
    if (isActiveElement && previousLastPosition) {
      if (action === "drag" && "x" in activeElement) {
        dispatch(
          edit({
            x: activeElement.x - previousLastPosition.x + lastPosition.x,
            y: activeElement.y - previousLastPosition.y + lastPosition.y
          })
        );
      }
      if (action === "rotation" && "x" in activeElement) {
        let rotate = (activeElement.x - lastPosition.x) / 2;
        dispatch(
          edit({
            rotation: rotate
          })
        );
      }
    }
  }, [lastPosition]);

  if (isActiveElement && activeElementMeta && activeElementMeta.width !== 0)
    return (
      <div
        className={s.container}
        style={{
          width: activeElementMeta?.width || 0,
          left: activeElementMeta.x || 0,
          top: activeElementMeta.y - 5 || 0
        }}>
        <div className={s.buttons}>
          <Button className={s.buttons__drag} onMouseDown={onMouseDownDrag}>
            d
          </Button>
          <Button
            className={s.buttons__rotation}
            onMouseDown={onMouseDownRotation}>
            r
          </Button>
        </div>
      </div>
    );

  return <></>;
};
