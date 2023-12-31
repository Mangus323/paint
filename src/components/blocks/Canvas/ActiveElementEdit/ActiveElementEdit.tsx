import React, { JSX, useContext, useEffect, useState } from "react";
import { MousePositionContext } from "@/components/HOC/MouseListener";
import { ScrollContext } from "@/components/HOC/ScrollProvider";
import { TableEdit } from "@/components/blocks/Canvas/ActiveElementEdit/TableEdit";
import { SimpleButton } from "@/components/elements/Button/Button";
import { sidebarDimension as sd, tp } from "@/globals/globals";
import { useActiveElement } from "@/hooks/useActiveElement";
import usePrevious from "@/hooks/usePrevious";
import { useAppSelector } from "@/redux/store";
import { calculateMetaSelection } from "@/utils/calculateMeta";
import { getSmoothAngle } from "@/utils/math";
import { Box, Tooltip } from "@mui/material";
import DragIcon from "~public/icons/Drag.svg";
import RotateIcon from "~public/icons/Rotate.svg";

export const ActiveElementEdit = (): JSX.Element => {
  const { activeElementMeta, selection } = useAppSelector(
    state => state.canvasMeta
  );
  const { isDrawing } = useAppSelector(state => state.canvas);
  const { zoom } = useAppSelector(state => state.browser);
  const { activeElement, setActiveElement } = useActiveElement();
  const { layerX, layerY } = useContext(ScrollContext).scroll;
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
      let angle = (position.x - startRotationPosition) / 2 + originalAngle;
      if (position.shiftKey) angle = getSmoothAngle(angle, 8);

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
      activeElementMeta.x + tp < 0 ? 0 : activeElementMeta.x + 5
    );
    const y = Math.min(
      window.innerHeight - sd.height,
      activeElementMeta.y + tp - 1 < sd.height
        ? sd.height - 10
        : activeElementMeta.y - tp - 1
    );
    return (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0
        }}
        style={{
          transform: `translate(${x}px, ${y}px)`
        }}>
        <TableEdit visible={!action} />
        <Box
          sx={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            display: "flex"
          }}>
          <Tooltip title={action ? "" : "Move"}>
            <SimpleButton
              sx={{
                cursor: "move !important",
                fontSize: 14
              }}
              onMouseDown={onMouseDownDrag}>
              <DragIcon />
            </SimpleButton>
          </Tooltip>
          <Tooltip title={action ? "" : "Rotate"}>
            <SimpleButton
              sx={{
                cursor: "e-resize !important",
                fontSize: 14
              }}
              onMouseDown={onMouseDownRotation}>
              <RotateIcon />
            </SimpleButton>
          </Tooltip>
        </Box>
      </Box>
    );
  }
  return <></>;
};
