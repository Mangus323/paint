"use client";

import React, { JSX } from "react";
import { useFontManager } from "@/hooks/useFontManager";
import { Font, getFontId } from "@/utils/FontManager";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface FontPickerProps {
  value: string;
  id?: string;
  onChange?: (font: Font) => void;
}

export const FontPicker = (props: FontPickerProps): JSX.Element => {
  const { id, onChange, value } = props;

  const { fonts, setActiveFontFamily } = useFontManager(onChange, value);

  const onSelection = (e: SelectChangeEvent): void => {
    setActiveFontFamily(e.target.value);
  };

  return (
    <>
      {fonts.length && (
        <Select
          onChange={onSelection}
          value={getFontId(value)}
          defaultValue={getFontId(value)}
          id={id}
          sx={{ width: "100%" }}>
          {fonts.map(font => {
            return (
              <MenuItem
                key={font.id}
                value={font.id}
                sx={{ fontFamily: font.family }}>
                {font.family}
              </MenuItem>
            );
          })}
        </Select>
      )}
    </>
  );
};
