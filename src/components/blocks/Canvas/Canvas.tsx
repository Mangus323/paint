import React, { JSX, useEffect } from "react";
import { ActiveElement } from "@/components/blocks/Canvas/ActiveElement/ActiveElement";
import { ActiveElementEdit } from "@/components/blocks/Canvas/ActiveElementEdit/ActiveElementEdit";
import { CustomEllipse } from "@/components/elements/Canvas/Ellipse/Ellipse";
import { Image } from "@/components/elements/Canvas/Image/Image";
import { useMouseHandlers } from "@/hooks/useMouseHandlers";
import { setIsDownloading } from "@/redux/slices/canvas/reducer";
import { AppDispatch, RootState } from "@/redux/store";
import { Layer, Line, Rect, Stage, Text } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import s from "./index.module.scss";

function downloadURI(uri, name) {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const Canvas = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { canvasHeight, canvasWidth } = useSelector(
    (state: RootState) => state.browser
  );
  const { elements, isDownloading } = useSelector(
    (state: RootState) => state.canvas
  );
  const { handleMouseDown, handleMouseMove, handleMouseUp, handleClick } =
    useMouseHandlers();
  const stageRef = React.useRef<any>(null);

  // save image
  useEffect(() => {
    if (isDownloading) {
      if (stageRef.current) {
        const uri = stageRef.current.toDataURL({ pixelRatio: 1 });
        downloadURI(uri, "image");
      }
      dispatch(setIsDownloading(false));
    }
  }, [isDownloading]);

  return (
    <section className={s.container}>
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}>
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
              case "image":
                return <Image {...element} key={index} />;
            }
          })}
          <ActiveElement />
        </Layer>
      </Stage>
      <ActiveElementEdit />
    </section>
  );
};
