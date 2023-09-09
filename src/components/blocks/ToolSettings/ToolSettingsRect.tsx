import React, { JSX } from "react";
import { AnimateHeight } from "@/components/elements/AnimateHeight/AnimateHeight";
import { LabelledSwitch } from "@/components/elements/LabelledSwitch/LabelledSwitch";
import { setSettings } from "@/redux/slices/settings/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Box, Slider, Typography } from "@mui/material";

export const ToolSettingsRect = (): JSX.Element => {
  const { fillType, strokeWidth, cornerRadius, dashEnabled } = useAppSelector(
    state => state.settings
  ).tools.rect;
  const dispatch = useAppDispatch();

  const onChangeFill = () => {
    dispatch(
      setSettings({
        tool: "rect",
        settings: {
          fillType: fillType === "fill" ? "outline" : "fill"
        }
      })
    );
  };

  const onChangeStroke = (e: Event) => {
    if (!e.target) return;
    const value = (e.target as any).value;
    dispatch(
      setSettings({
        tool: "rect",
        settings: {
          strokeWidth: value
        }
      })
    );
  };

  const onChangeRadius = (e: Event) => {
    if (!e.target) return;
    const value = (e.target as any).value;
    dispatch(
      setSettings({
        tool: "rect",
        settings: {
          cornerRadius: value
        }
      })
    );
  };

  const onChangeDash = () => {
    dispatch(
      setSettings({
        tool: "rect",
        settings: {
          dashEnabled: !dashEnabled
        }
      })
    );
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
        <Typography color={"inherit"} sx={{ pt: "0.25rem" }}>
          Stroke width
        </Typography>
        <Box>
          <Slider
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
      <Typography color={"inherit"}>Border radius (%)</Typography>
      <Box>
        <Slider
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
