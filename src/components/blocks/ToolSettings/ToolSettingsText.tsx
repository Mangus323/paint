import React, { JSX } from "react";
import { useDispatchSettings } from "@/hooks/useDispatchSettings";
import { useAppSelector } from "@/redux/store";
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from "@mui/material";

export const ToolSettingsText = (): JSX.Element => {
  const { fontSize } = useAppSelector(state => state.settings).tools.text;
  const dispatchSettings = useDispatchSettings("text");

  const onChangeFontsize = (e: SelectChangeEvent<number>) => {
    if (!e.target) return;
    const value = e.target.value;
    dispatchSettings("fontSize", +value);
  };

  return (
    <>
      <Typography variant={"h6"} color={"inherit"} align={"center"}>
        Text settings
      </Typography>
      <Typography
        color={"inherit"}
        component={"label"}
        htmlFor={"text_settings-font_size"}>
        Font size
      </Typography>
      <Box>
        <Select
          id={"text_settings-font_size"}
          type={"number"}
          value={fontSize}
          renderValue={value => value + "px"}
          onChange={onChangeFontsize}
          sx={{ width: "100%" }}>
          {[8, 9, 10, 12, 14, 16, 20, 24, 28, 36, 48, 72, 144].map(number => (
            <MenuItem value={number} key={number}>
              {number}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </>
  );
};
