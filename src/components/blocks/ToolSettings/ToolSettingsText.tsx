import React, { JSX } from "react";
import { Button } from "@/components/elements/Button/Button";
import { useDispatchSettings } from "@/hooks/useDispatchSettings";
import { useAppSelector } from "@/redux/store";
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from "@mui/material";
import clsx from "clsx";

export const ToolSettingsText = (): JSX.Element => {
  const { fontSize, fontFamily, fontStyle, textDecoration } = useAppSelector(
    state => state.settings
  ).tools.text;
  const dispatchSettings = useDispatchSettings("text");

  const selectedBold = fontStyle.includes("bold");
  const selectedItalic = fontStyle.includes("italic");
  const selectedUnderline = textDecoration.includes("underline");
  const selectedLineThrough = textDecoration.includes("line-through");

  const onChangeFontsize = (e: SelectChangeEvent<number>) => {
    if (!e.target) return;
    const value = e.target.value;
    dispatchSettings("fontSize", +value);
  };

  const onChangeDecoration = (target: string) => {
    if (target === "bold" || target === "italic") {
      const isBold = selectedBold !== (target === "bold");
      const isItalic = selectedItalic !== (target === "italic");
      dispatchSettings(
        "fontStyle",
        clsx(isItalic && "italic", isBold && "bold")
      );
    }
    if (target === "underline" || target === "line-through") {
      const isUnderline = selectedUnderline !== (target === "underline");
      const isLineThrough = selectedLineThrough !== (target === "line-through");
      dispatchSettings(
        "textDecoration",
        clsx(isUnderline && "underline", isLineThrough && "line-through")
      );
    }
  };

  return (
    <>
      <Typography variant={"h6"} color={"inherit"} align={"center"}>
        Text settings
      </Typography>
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <Button
          onClick={() => onChangeDecoration("bold")}
          selected={selectedBold}>
          B
        </Button>
        <Button
          onClick={() => onChangeDecoration("italic")}
          selected={selectedItalic}>
          I
        </Button>
        <Button
          onClick={() => onChangeDecoration("line-through")}
          selected={selectedLineThrough}>
          T
        </Button>
        <Button
          onClick={() => onChangeDecoration("underline")}
          selected={selectedUnderline}>
          U
        </Button>
      </Box>
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
