import React, { ChangeEvent, JSX } from "react";
import { Button } from "@/components/elements/Button/Button";
import { FileUploader } from "@/components/elements/FileUploader/FileUploader";
import {
  openFromFile,
  place,
  setIsDownloading
} from "@/redux/slices/canvas/reducer";
import { AppDispatch } from "@/redux/store";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";

export const TopPanel = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();

  const onSaveClick = () => {
    dispatch(place());
    dispatch(setIsDownloading(true));
  };

  const onOpenClick = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      reader.onloadend = () => {
        if (reader.result) dispatch(openFromFile(reader.result));
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      component={"section"}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 0.5,
        borderBottom: "1px solid var(--teal-300)",
        backgroundColor: "var(--teal-100)",
        gap: 0.5
      }}>
      <FileUploader onChange={onOpenClick}>Open</FileUploader>
      <Button styleType={"default"} onClick={onSaveClick}>
        Save
      </Button>
    </Box>
  );
};
