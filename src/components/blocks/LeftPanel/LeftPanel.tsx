import React, { JSX } from "react";
import { ColorPanel } from "@/components/blocks/LeftPanel/ColorPanel/ColorPanel";
import { ToolPicker } from "@/components/blocks/LeftPanel/ToolPicker/ToolPicker";
import { Separator } from "@/components/elements/Separator/Separator";
import { Box } from "@mui/material";

export const LeftPanel = (): JSX.Element => {
  return (
    <Box
      component={"section"}
      sx={{
        padding: 0.5,
        borderRight: "1px solid var(--teal-300)",
        backgroundColor: "var(--teal-100)",
        textAlign: "center",
        fontWeight: 400,
        lineHeight: "150%",
        overflowY: "auto",
        "& > ul": {
          display: "grid",
          gridGap: "2px",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          "& > li > *": {
            width: "100%"
          }
        },
        "& > h3": {
          fontSize: 14,
          fontWeight: 400
        },
        "& > p": {
          fontSize: 12
        }
      }}>
      <ToolPicker />
      <Separator orientation={"horizontal"} />
      <ColorPanel />
    </Box>
  );
};
