"use client";

import React, { JSX } from "react";
import { useFontManager } from "@/hooks/useFontManager";
import { Font, getFontId } from "@/utils/FontManager";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import LoaderIcon from "~public/icons/Loader.svg";

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
      {fonts.length === 0 && (
        <Select
          sx={{
            width: "100%",
            "& .MuiSelect-select": {
              display: "flex",
              width: "100%",
              alignItems: "center",
              textTransform: "capitalize",
              "& > *:last-child": {
                fontSize: "1.2rem"
              }
            }
          }}
          disabled
          defaultValue={"Roboto"}
          renderValue={_ => (
            <>
              {getFontId(value)} <LoaderIcon />
            </>
          )}>
          <MenuItem value={"Roboto"} />
        </Select>
      )}
      {fonts.length !== 0 && (
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
                style={{ fontFamily: font.family }}
                sx={{ minWidth: "12rem" }}>
                {font.family}
              </MenuItem>
            );
          })}
        </Select>
      )}
    </>
  );
};
