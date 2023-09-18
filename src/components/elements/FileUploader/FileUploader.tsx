import React, { JSX } from "react";
import { Box, Typography } from "@mui/material";

interface FileUploaderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> {}

export const FileUploader = (props: FileUploaderProps): JSX.Element => {
  const { children, ...inputProps } = props;
  return (
    <Box
      component={"label"}
      sx={{
        position: "relative",
        display: "inline-block"
      }}>
      <input
        style={{
          position: "absolute",
          zIndex: -1,
          display: "block",
          width: 0,
          height: 0,
          opacity: 0
        }}
        type={"file"}
        {...inputProps}
        accept={"image/png"}
      />
      <Typography
        component={"span"}
        sx={{
          fontSize: 12,
          position: "relative",
          display: "flex",
          height: "1.25rem",
          alignItems: "center",
          justifyContent: "center",
          padding: "2px 4px",
          border: "1px solid var(--teal-200)",
          borderRadius: "2px",
          backgroundColor: "var(--light-gray)",
          color: "var(--blue)",
          gap: "10px",
          gridGap: "10px",
          outline: "none",
          transition: "0.1s all",
          userSelect: "none",
          "&:hover": {
            border: "1px solid var(--black)"
          },
          "&:active": {
            border: "1px solid var(--black)",
            backgroundColor: "var(--teal-300)"
          }
        }}>
        {children}
      </Typography>
    </Box>
  );
};
