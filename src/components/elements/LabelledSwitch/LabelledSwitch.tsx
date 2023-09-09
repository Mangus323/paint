import React, { JSX } from "react";
import {
  FormControlLabel,
  FormControlLabelProps,
  Switch,
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
      control={<Switch sx={{ ml: "0.25rem" }} />}
      sx={{
        textTransform: "capitalize",
        color: theme.palette.primary.contrastText,
        ...sx
      }}
    />
  );
};
