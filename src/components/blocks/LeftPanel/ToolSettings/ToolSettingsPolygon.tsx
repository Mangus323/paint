import React, { JSX } from "react";
import { AnimateHeight } from "@/components/elements/AnimateHeight/AnimateHeight";
import { Button } from "@/components/elements/Button/Button";
import { LabelledSwitch } from "@/components/elements/LabelledSwitch/LabelledSwitch";
import { useDispatchSettings } from "@/hooks/useDispatchSettings";
import { useAppSelector } from "@/redux/store";
import { Box, Slider, Tooltip, Typography } from "@mui/material";
import Polygon3Icon from "~public/icons/Polygon3.svg";
import Polygon5Icon from "~public/icons/Polygon5.svg";
import Polygon6Icon from "~public/icons/Polygon6.svg";
import Polygon8Icon from "~public/icons/Polygon8.svg";

export const ToolSettingsPolygon = (): JSX.Element => {
  const { fillType, strokeWidth, dashEnabled, sides } = useAppSelector(
    state => state.settings
  ).tools.polygon;
  const dispatchSettings = useDispatchSettings("polygon");

  const onChangeFill = () => {
    dispatchSettings("fillType", fillType === "fill" ? "outline" : "fill");
  };

  const onChangeStroke = (e: Event) => {
    if (!e.target) return;
    const value = (e.target as any).value;
    dispatchSettings("strokeWidth", value);
  };

  const onChangeSidesCount = (count: number) => {
    dispatchSettings("sides", count);
  };

  const onChangeDash = () => {
    dispatchSettings("dashEnabled", !dashEnabled);
  };

  return (
    <>
      <Typography variant={"h6"} color={"inherit"} align={"center"}>
        Polygon settings
      </Typography>
      <Typography color={"inherit"}>Sides count</Typography>
      <Box sx={{ display: "flex", gap: 0.5, marginBottom: "0.25rem" }}>
        <Tooltip title={"3"}>
          <Button onClick={() => onChangeSidesCount(3)} selected={sides === 3}>
            <Polygon3Icon />
          </Button>
        </Tooltip>
        <Tooltip title={"5"}>
          <Button onClick={() => onChangeSidesCount(5)} selected={sides === 5}>
            <Polygon5Icon />
          </Button>
        </Tooltip>
        <Tooltip title={"6"}>
          <Button onClick={() => onChangeSidesCount(6)} selected={sides === 6}>
            <Polygon6Icon />
          </Button>
        </Tooltip>
        <Tooltip title={"8"}>
          <Button onClick={() => onChangeSidesCount(8)} selected={sides === 8}>
            <Polygon8Icon />
          </Button>
        </Tooltip>
      </Box>
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
          htmlFor={"polygon_settings-stroke_width"}>
          Stroke width
        </Typography>
        <Box>
          <Slider
            id={"polygon_settings-stroke_width"}
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
