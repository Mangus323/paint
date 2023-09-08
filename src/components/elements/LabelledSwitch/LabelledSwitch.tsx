import React, { JSX } from "react";
import { Switch } from "@/components/elements/Switch/Switch";
import {
  FormControlLabel,
  FormControlLabelProps,
  useTheme
} from "@mui/material";

export const LabelledSwitch = (
  props: Omit<FormControlLabelProps, "control">
): JSX.Element => {
  const { sx, ...otherProps } = props;
  const theme = useTheme();
  return (
    <FormControlLabel
      {...otherProps}
      control={<Switch />}
      sx={{
        textTransform: "capitalize",
        color: theme.palette.primary.contrastText,
        ...sx
      }}
    />
  );
};
