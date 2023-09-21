import React, { JSX } from "react";
import { Button } from "@/components/elements/Button/Button";
import { Box } from "@mui/material";

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
      <Button styleType={"default"} component={"span"}>
        {children}
      </Button>
    </Box>
  );
};
