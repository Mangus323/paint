import React, { JSX } from "react";
import { AnimateHeight } from "@/components/elements/AnimateHeight/AnimateHeight";
import { LabelledSwitch } from "@/components/elements/LabelledSwitch/LabelledSwitch";
import { useDispatchSettings } from "@/hooks/useDispatchSettings";
import { useAppSelector } from "@/redux/store";
import { Box, Slider, Typography } from "@mui/material";

export const ToolSettingsRect = (): JSX.Element => {
  const { fillType, strokeWidth, cornerRadius, dashEnabled } = useAppSelector(
    state => state.settings
  ).tools.rect;
  const dispatchSettings = useDispatchSettings("rect");

  const onChangeFill = () => {
    dispatchSettings("fillType", fillType === "fill" ? "outline" : "fill");
  };

  const onChangeStroke = (e: Event) => {
    if (!e.target) return;
    const value = (e.target as any).value;
    dispatchSettings("strokeWidth", value);
  };

  const onChangeRadius = (e: Event) => {
    if (!e.target) return;
    const value = (e.target as any).value;
    dispatchSettings("cornerRadius", value);
  };

  const onChangeDash = () => {
    dispatchSettings("dashEnabled", !dashEnabled);
  };

  return (
    <>
      <Typography variant={"h6"} color={"inherit"} align={"center"}>
        Rect settings
      </Typography>
      <LabelledSwitch
        label={fillType}
        onChange={onChangeFill}
        checked={fillType === "fill"}
      />
      <AnimateHeight open={fillType === "outline"}>
        <Typography
          color={"inherit"}
          sx={{ pt: "0.25rem" }}
          component={"label"}
          htmlFor={"rect_settings-stroke_width"}>
          Stroke width
        </Typography>
        <Box>
          <Slider
            id={"rect_settings-stroke_width"}
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
      </AnimateHeight>
      <Typography
        color={"inherit"}
        htmlFor={"rect_settings-border_radius"}
        component={"label"}
        sx={{ display: "block" }}>
        Border radius (%)
      </Typography>
      <Box>
        <Slider
          id={"rect_settings-border_radius"}
          aria-label="Border Radius"
          value={cornerRadius}
          onChange={onChangeRadius}
          valueLabelDisplay={"auto"}
          step={1}
          min={0}
          max={100}
        />
      </Box>
    </>
  );
};
