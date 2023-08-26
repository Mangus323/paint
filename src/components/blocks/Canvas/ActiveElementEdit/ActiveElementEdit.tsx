import React, { JSX, useContext, useEffect, useState } from "react";
import { MousePositionContext } from "@/components/HOC/MouseListener/MouseListener";
import { Button } from "@/components/elements/Button/Button";
import { sidebarDimension as sd } from "@/globals/sidebar";
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
  const position = useContext(MousePositionContext);
  const previousLastPosition = usePrevious<typeof position>(position);
  const [action, setAction] = useState<string | null>(null);
  const [originalAngle, setOriginalAngle] = useState(0);

  const onMouseDownDrag = () => {
    setAction("drag");
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseDownRotation = () => {
    setAction("rotation");
    document.addEventListener("mouseup", onMouseUp);
    setOriginalAngle(activeElement.rotation || 0);
  };

  const onMouseUp = () => {
    document.removeEventListener("mouseup", onMouseUp);
    setAction(null);
  };

  useEffect(() => {
    if (!action) return;
    if (isActiveElement && previousLastPosition) {
      if (action === "drag" && "x" in activeElement) {
        dispatch(
          edit({
            x: activeElement.x - previousLastPosition.x + position.x,
            y: activeElement.y - previousLastPosition.y + position.y
          })
        );
      }
      if (action === "rotation" && "x" in activeElement) {
        const angle =
          (activeElement.x - position.x + sd.width + 22) / 2 + originalAngle;
        dispatch(
          edit({
            rotation: angle
          })
        );
      }
    }
  }, [position]);

  if (isActiveElement && activeElementMeta && activeElementMeta)
    return (
      <div
        className={s.container}
        style={{
          width: activeElementMeta?.width || 0,
          transform: `translate(${activeElementMeta.x || 0}px, ${
            activeElementMeta.y - 5 || 0
          }px)`
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
