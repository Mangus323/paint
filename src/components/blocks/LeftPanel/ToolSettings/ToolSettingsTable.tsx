import React, { JSX } from "react";
import { Button } from "@/components/elements/Button/Button";
import { useDispatchSettings } from "@/hooks/useDispatchSettings";
import { useAppSelector } from "@/redux/store";
import { Box, Slider, Tooltip, Typography } from "@mui/material";
import TableFillIcon from "~public/icons/TableFill.svg";
import TableOutlineIcon from "~public/icons/TableOutline.svg";

export const ToolSettingsTable = (): JSX.Element => {
  const { fillType, strokeWidth, columns, rows } = useAppSelector(
    state => state.settings
  ).tools.table;
  const dispatchSettings = useDispatchSettings("table");

  const onChangeFill = (fill: typeof fillType) => {
    dispatchSettings("fillType", fill);
  };

  const onChangeStroke = (e: Event) => {
    if (!e.target) return;
    const value = (e.target as any).value;
    dispatchSettings("strokeWidth", value);
  };

  const onChangeColumns = (e: Event) => {
    if (!e.target) return;
    const value = (e.target as any).value;
    dispatchSettings("columns", value);
  };

  const onChangeRows = (e: Event) => {
    if (!e.target) return;
    const value = (e.target as any).value;
    dispatchSettings("rows", value);
  };

  return (
    <>
      <Typography variant={"h6"} color={"inherit"} align={"center"}>
        Table settings
      </Typography>
      <Box sx={{ display: "flex", gap: 0.5, marginBottom: "0.25rem" }}>
        <Tooltip title={"Outline"}>
          <Button
            onClick={() => onChangeFill("outline")}
            selected={fillType === "outline"}>
            <TableOutlineIcon />
          </Button>
        </Tooltip>
        <Tooltip title={"Fill"}>
          <Button
            onClick={() => onChangeFill("fill")}
            selected={fillType === "fill"}>
            <TableFillIcon />
          </Button>
        </Tooltip>
      </Box>
      <Box>
        <Typography
          color={"inherit"}
          sx={{ pt: "0.25rem" }}
          component={"label"}
          htmlFor={"table_settings-stroke_width"}>
          Stroke width
        </Typography>
        <Slider
          id={"table_settings-stroke_width"}
          aria-label="Stroke width"
          value={strokeWidth}
          onChange={onChangeStroke}
          valueLabelDisplay={"auto"}
          step={1}
          min={1}
          max={50}
        />
      </Box>
      <Typography
        color={"inherit"}
        sx={{ pt: "0.25rem" }}
        component={"label"}
        htmlFor={"table_settings-stroke_width"}>
        Columns
      </Typography>
      <Box>
        <Slider
          id={"table_settings-columns_count"}
          aria-label="Columns"
          value={columns}
          onChange={onChangeColumns}
          valueLabelDisplay={"auto"}
          step={1}
          min={1}
          max={20}
        />
      </Box>
      <Typography
        color={"inherit"}
        sx={{ pt: "0.25rem" }}
        component={"label"}
        htmlFor={"rect_settings-stroke_width"}>
        Rows
      </Typography>
      <Box>
        <Slider
          id={"rect_settings-rows_count"}
          aria-label="Rows"
          value={rows}
          onChange={onChangeRows}
          valueLabelDisplay={"auto"}
          step={1}
          min={1}
          max={20}
        />
      </Box>
    </>
  );
};
