import React, { JSX } from "react";
import { AnimateHeight } from "@/components/elements/AnimateHeight/AnimateHeight";
import { LabelledSwitch } from "@/components/elements/LabelledSwitch/LabelledSwitch";
import { useDispatchSettings } from "@/hooks/useDispatchSettings";
import { useAppSelector } from "@/redux/store";
import { Box, Slider, Typography } from "@mui/material";

export const ToolSettingsEllipse = (): JSX.Element => {
  const { fillType, strokeWidth, dashEnabled } = useAppSelector(
    state => state.settings.tools.ellipse
  );
  const dispatchSettings = useDispatchSettings("ellipse");

  const onChangeFill = () => {
    dispatchSettings("fillType", fillType === "fill" ? "outline" : "fill");
  };

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
        Ellipse settings
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
          htmlFor={"ellipse_settings-stroke_width"}>
          Stroke width
        </Typography>
        <Box>
          <Slider
            id={"ellipse_settings-stroke_width"}
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
    </>
  );
};
