import React, { JSX } from "react";
import { useDispatchSettings } from "@/hooks/useDispatchSettings";
import { useAppSelector } from "@/redux/store";
import { Box, Slider, Typography } from "@mui/material";

export const ToolSettingsEraser = (): JSX.Element => {
  const { strokeWidth } = useAppSelector(state => state.settings).tools.eraser;
  const dispatchSettings = useDispatchSettings("eraser");

  const onChangeStroke = (e: Event) => {
    if (!e.target) return;
    const value = (e.target as any).value;
    dispatchSettings("strokeWidth", value);
  };

  return (
    <>
      <Typography variant={"h6"} color={"inherit"} align={"center"}>
        Eraser settings
      </Typography>
      <Typography
        color={"inherit"}
        component={"label"}
        htmlFor={"eraser_settings-stroke_width"}>
        Stroke width
      </Typography>
      <Box>
        <Slider
          id={"eraser_settings-stroke_width"}
          aria-label="Stroke width"
          value={strokeWidth}
          onChange={onChangeStroke}
          valueLabelDisplay={"auto"}
          step={1}
          min={1}
          max={100}
        />
      </Box>
    </>
  );
};
