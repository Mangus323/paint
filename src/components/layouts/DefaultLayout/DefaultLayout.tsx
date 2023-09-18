import React, { JSX } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material";

interface LayoutProps {
  children: React.ReactNode;
}

export const DefaultLayout = ({ children }: LayoutProps): JSX.Element => {
  const theme = useTheme();

  return (
    <Box
      component={"main"}
      sx={{
        display: "grid",
        height: "100vh",
        color: theme.palette.primary.contrastText,
        gridTemplateColumns: "50px 1fr",
        gridTemplateRows: "30px 1fr",
        "& > *:first-of-type": {
          gridColumn: "1 / 3"
        }
      }}>
      {children}
    </Box>
  );
};
