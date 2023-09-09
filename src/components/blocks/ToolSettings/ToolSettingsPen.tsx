import React, { JSX } from "react";
import { LabelledSwitch } from "@/components/elements/LabelledSwitch/LabelledSwitch";
import { setSettings } from "@/redux/slices/settings/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Box, Slider, Typography } from "@mui/material";

export const ToolSettingsPen = (): JSX.Element => {
  const { strokeWidth, dashEnabled } = useAppSelector(state => state.settings)
    .tools.pen;
  const dispatch = useAppDispatch();

  const onChangeStroke = (e: Event) => {
    if (!e.target) return;
    const value = (e.target as any).value;
    dispatch(
      setSettings({
        tool: "pen",
        settings: {
          strokeWidth: value
        }
      })
    );
  };

  const onChangeDash = () => {
    dispatch(
      setSettings({
        tool: "pen",
        settings: {
          dashEnabled: !dashEnabled
        }
      })
    );
  };

  return (
    <>
      <Typography variant={"h6"} color={"inherit"} align={"center"}>
        Pen settings
      </Typography>
      <Typography color={"inherit"}>Stroke width</Typography>
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
    </>
  );
};
