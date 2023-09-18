import React, { JSX } from "react";
import { Box } from "@mui/material";

type OrientationType = "vertical" | "horizontal";

interface SeparatorProps {
  orientation: OrientationType;
}

export const Separator = (props: SeparatorProps): JSX.Element => {
  const { orientation } = props;
  return (
    <Box
      sx={{
        backgroundColor: "var(--teal-300)",
        ...(orientation === "vertical"
          ? {
              width: "1px",
              height: "100%",
              margin: "0 5px"
            }
          : {
              width: "100%",
              height: "1px",
              margin: "5px 0"
            })
      }}
    />
  );
};
