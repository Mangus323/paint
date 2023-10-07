import React, { JSX } from "react";
import { LabelledSwitch } from "@/components/elements/LabelledSwitch/LabelledSwitch";
import { useDispatchSettings } from "@/hooks/useDispatchSettings";
import { useAppSelector } from "@/redux/store";
import { Box, Slider, Typography } from "@mui/material";

export const ToolSettingsPen = (): JSX.Element => {
  const { strokeWidth, dashEnabled } = useAppSelector(state => state.settings)
    .tools.pen;
  const dispatchSettings = useDispatchSettings("pen");

  const onChangeStroke = (e: Event) => {
    if (!e.target) return;
    const value = (e.target as any).value;
    dispatchSettings("strokeWidth", value);
  };

  const onChangeDash = () => {
    dispatchSettings("dashEnabled", !dashEnabled);
  };

  return (
    <>
      <Typography variant={"h6"} color={"inherit"} align={"center"}>
        Pen settings
      </Typography>
      <Typography
        color={"inherit"}
        component={"label"}
        htmlFor={"pen_settings-stroke_width"}>
        Stroke width
      </Typography>
      <Box>
        <Slider
          id={"pen_settings-stroke_width"}
          aria-label="Outline stroke width"
          value={strokeWidth}
          onChange={onChangeStroke}
          valueLabelDisplay={"auto"}
          step={1}
          min={1}
          max={50}
        />
      </Box>
      <LabelledSwitch
        label={"enable dash"}
        onChange={onChangeDash}
        checked={dashEnabled}
      />
    </>
  );
};
