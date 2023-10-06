import React, { JSX, useContext, useEffect, useState } from "react";
import { MousePositionContext } from "@/components/HOC/MouseListener/MouseListener";
import { SimpleButton } from "@/components/elements/Button/Button";
import { sidebarDimension as sd } from "@/globals/globals";
import { useActiveElement } from "@/hooks/useActiveElement";
import usePrevious from "@/hooks/usePrevious";
import { useAppSelector } from "@/redux/store";
import { calculateMetaSelection } from "@/utils/calculateMeta";
import { Box } from "@mui/material";
import DragIcon from "~public/icons/Drag.svg";
import RotateIcon from "~public/icons/Rotate.svg";

export const ActiveElementEdit = (): JSX.Element => {
  const { activeElementMeta, selection } = useAppSelector(
    state => state.canvasMeta
  );
  const { isDrawing } = useAppSelector(state => state.canvas);
  const { zoom, layerX, layerY } = useAppSelector(state => state.browser);
  const { activeElement, setActiveElement } = useActiveElement();
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
    if (activeElement && "rotation" in activeElement)
      setOriginalAngle(activeElement.rotation || 0);
    setStartRotationPosition(position.x);
  };

  const onMouseUp = () => {
    document.removeEventListener("mouseup", onMouseUp);
    setAction(null);
  };

  useEffect(() => {
    if (!action || !previousLastPosition) return;
    if (activeElement && action === "drag" && "x" in activeElement) {
      setActiveElement({
        ...activeElement,
        x: activeElement.x - (previousLastPosition.x - position.x) / zoom,
        y: activeElement.y - (previousLastPosition.y - position.y) / zoom
      });
    }
    if (activeElement && action === "rotation" && "x" in activeElement) {
      const angle = (position.x - startRotationPosition) / 2 + originalAngle;
      setActiveElement({
        ...activeElement,
        rotation: angle
      });
    }
  }, [position, zoom]);

  if (selection) {
    const dimension = calculateMetaSelection(selection);
    return (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          border: "1px dashed var(--black)",
          background: "transparent",
          pointerEvents: "none"
        }}
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
    activeElement &&
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
      activeElementMeta.y + 4 < sd.height
        ? sd.height - 6
        : activeElementMeta.y - 6
    );
    return (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 2
        }}
        style={{
          transform: `translate(${x}px, ${y}px)`
        }}>
        <Box
          sx={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            display: "flex"
          }}>
          <SimpleButton
            sx={{
              cursor: "move !important",
              fontSize: 14
            }}
            onMouseDown={onMouseDownDrag}>
            <DragIcon />
          </SimpleButton>
          <SimpleButton
            sx={{
              cursor: "e-resize !important",
              fontSize: 14
            }}
            onMouseDown={onMouseDownRotation}>
            <RotateIcon />
          </SimpleButton>
        </Box>
      </Box>
    );
  }
  return <></>;
};
