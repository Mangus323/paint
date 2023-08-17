import React, { JSX } from "react";
import { ActiveElement } from "@/components/blocks/Canvas/ActiveElement/ActiveElement";
import { ActiveElementEdit } from "@/components/blocks/Canvas/ActiveElementEdit/ActiveElementEdit";
import { CustomEllipse } from "@/components/elements/Canvas/Ellipse/Ellipse";
import { useMouseHandlers } from "@/hooks/useMouseHandlers";
import { RootState } from "@/redux/store";
import { Layer, Line, Rect, Stage, Text } from "react-konva";
import { useSelector } from "react-redux";
import s from "./index.module.scss";

export const Canvas = (): JSX.Element => {
  const { canvasHeight, canvasWidth } = useSelector(
    (state: RootState) => state.browser
  );
  const { elements } = useSelector((state: RootState) => state.canvas);
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleClick,
    ...activeElement
  } = useMouseHandlers();

  return (
    <section className={s.container}>
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}>
        <Layer>
          {elements.map((element, index) => {
            switch (element.tool) {
              case "rect":
                return <Rect {...element} fill={element.color} key={index} />;
              case "ellipse":
                return <CustomEllipse {...element} key={index} />;
              case "pen":
                return (
                  <Line
                    {...element}
                    key={index}
                    globalCompositeOperation={"source-over"}
                    stroke={element.color}
                    strokeWidth={5}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                  />
                );
              case "eraser":
                return (
                  <Line
                    {...element}
                    key={index}
                    stroke={"#ffffff"}
                    globalCompositeOperation={"destination-out"}
                  />
                );
              case "text":
                return <Text {...element} fill={element.color} key={index} />;
            }
          })}
          <ActiveElement {...activeElement} />
        </Layer>
      </Stage>
      <ActiveElementEdit />
    </section>
  );
};
