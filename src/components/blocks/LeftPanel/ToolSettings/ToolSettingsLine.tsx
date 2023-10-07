import React, { JSX } from "react";
import { Button } from "@/components/elements/Button/Button";
import { useDispatchSettings } from "@/hooks/useDispatchSettings";
import { useAppSelector } from "@/redux/store";
import { ILine } from "@/types/canvas";
import { Box, Slider, Typography } from "@mui/material";
import ArrowCircleIcon from "~public/icons/ArrowCircle.svg";
import ArrowLineIcon from "~public/icons/ArrowLine.svg";
import ArrowTriangleIcon from "~public/icons/ArrowTriangle.svg";
import LineIcon from "~public/icons/Line.svg";

export const ToolSettingsLine = (): JSX.Element => {
  const { strokeWidth, arrowType } = useAppSelector(
    state => state.settings.tools.line
  );
  const dispatchSettings = useDispatchSettings("line");

  const onChangeStroke = (e: Event) => {
    if (!e.target) return;
    const value = (e.target as any).value;
    dispatchSettings("strokeWidth", value);
  };

  const onChangeArrowType = (arrowType: ILine["arrowType"]) => {
    dispatchSettings("arrowType", arrowType);
  };

  return (
    <>
      <Typography variant={"h6"} color={"inherit"} align={"center"}>
        Line settings
      </Typography>
      <Typography color={"inherit"}>Arrow type</Typography>
      <Box sx={{ display: "flex", gap: 0.5, marginBottom: "0.25rem" }}>
        <Button
          onClick={() => onChangeArrowType("none")}
          selected={arrowType === "none"}>
          <LineIcon />
        </Button>
        <Button
          onClick={() => onChangeArrowType("line")}
          selected={arrowType === "line"}>
          <ArrowLineIcon />
        </Button>
        <Button
          onClick={() => onChangeArrowType("triangle")}
          selected={arrowType === "triangle"}>
          <ArrowTriangleIcon />
        </Button>
        <Button
          onClick={() => onChangeArrowType("circle")}
          selected={arrowType === "circle"}>
          <ArrowCircleIcon />
        </Button>
      </Box>
      <Typography
        color={"inherit"}
        component={"label"}
        htmlFor={"line_settings-stroke_width"}>
        Stroke width
      </Typography>
      <Box>
        <Slider
          id={"line_settings-stroke_width"}
          aria-label="Stroke width"
          value={strokeWidth}
          onChange={onChangeStroke}
          valueLabelDisplay={"auto"}
          step={1}
          min={1}
          max={50}
        />
      </Box>
    </>
  );
};
