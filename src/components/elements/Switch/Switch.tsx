import React, { JSX } from "react";
import {
  Switch as MuiSwitch,
  SwitchProps as MuiSwitchProps
} from "@mui/material";

interface SwitchProps extends MuiSwitchProps {}

export const Switch = (props: SwitchProps): JSX.Element => {
  return <MuiSwitch {...props} size={"small"}></MuiSwitch>;
};
