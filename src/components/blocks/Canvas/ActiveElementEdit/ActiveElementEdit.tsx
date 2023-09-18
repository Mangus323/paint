import React, { JSX, useContext, useEffect, useState } from "react";
import { MousePositionContext } from "@/components/HOC/MouseListener/MouseListener";
import { Button } from "@/components/elements/Button/Button";
import { sidebarDimension as sd } from "@/globals/globals";
import usePrevious from "@/hooks/usePrevious";
import { edit } from "@/redux/slices/canvas/reducer";
import { useActiveElement } from "@/redux/slices/canvas/selectors";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { calculateMetaSelection } from "@/utils/calculateMeta";
import DragIcon from "~public/icons/Drag.svg";
import RotateIcon from "~public/icons/Rotate.svg";
import s from "./index.module.scss";

export const ActiveElementEdit = (): JSX.Element => {
  const { activeElementMeta, selection } = useAppSelector(
    state => state.canvasMeta
  );
  const { isDrawing } = useAppSelector(state => state.canvas);
  const { zoom, layerX, layerY } = useAppSelector(state => state.browser);
  const { isActiveElement, activeElement } = useActiveElement();
  const dispatch = useAppDispatch();
  const position = useContext(MousePositionContext);
  const previousLastPosition = usePrevious<typeof position>(position);
  const [action, setAction] = useState<string | null>(null);
  const [originalAngle, setOriginalAngle] = useState(0);
  const [startRotationPosition, setStartRotationPosition] = useState(0);

  const onMouseDownDrag = () => {
    setAction("drag");
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseDownRotation = () => {
    setAction("rotation");
    document.addEventListener("mouseup", onMouseUp);
    if ("rotation" in activeElement)
      setOriginalAngle(activeElement.rotation || 0);
    setStartRotationPosition(position.x);
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
            x: activeElement.x - (previousLastPosition.x - position.x) / zoom,
            y: activeElement.y - (previousLastPosition.y - position.y) / zoom
          })
        );
      }
      if (action === "rotation" && "x" in activeElement) {
        const angle = (position.x - startRotationPosition) / 2 + originalAngle;
        dispatch(
          edit({
            rotation: angle
          })
        );
      }
    }
  }, [position, zoom]);

  if (selection) {
    const dimension = calculateMetaSelection(selection);
    return (
      <div
        className={s.selection}
        style={{
          width: dimension.width || 0,
          height: dimension.height || 0,
          transform: `translate(${(dimension.x || 0) + layerX}px, ${
            (dimension.y || 0) + layerY
          }px)`
        }}
      />
    );
  }

  if (
    isActiveElement &&
    activeElementMeta &&
    !isDrawing &&
    action !== "rotation"
  ) {
    const x = Math.min(
      window.innerWidth - sd.width - 40,
      activeElementMeta.x + 5 < 0 ? 0 : activeElementMeta.x + 5
    );
    const y = Math.min(
      window.innerHeight - sd.height,
      activeElementMeta.y + 8 < sd.height
        ? sd.height - 10
        : activeElementMeta.y - 2
    );
    return (
      <div
        className={s.container}
        style={{
          transform: `translate(${x}px, ${y}px)`
        }}>
        <div className={s.buttons}>
          <Button className={s.buttons__drag} onMouseDown={onMouseDownDrag}>
            <DragIcon />
          </Button>
          <Button
            className={s.buttons__rotation}
            onMouseDown={onMouseDownRotation}>
            <RotateIcon />
          </Button>
        </div>
      </div>
    );
  }
  return <></>;
};
