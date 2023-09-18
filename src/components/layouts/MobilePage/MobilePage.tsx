import React, { JSX } from "react";
import { Box, Typography } from "@mui/material";

export const MobilePage = (): JSX.Element => {
  return (
    <Box sx={{ padding: 4 }} component={"main"}>
      <Typography variant={"h1"}>
        Paint {"doesn't"} work on mobile devices
      </Typography>
    </Box>
  );
};
