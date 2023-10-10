import React, { ChangeEvent, JSX } from "react";
import { SaveFileModal } from "@/components/blocks/TopPanel/SaveFileModal/SaveFileModal";
import { Button } from "@/components/elements/Button/Button";
import { FileUploader } from "@/components/elements/FileUploader/FileUploader";
import { useActiveElement } from "@/hooks/useActiveElement";
import {
  openFromFile,
  setIsOpenDownloadModal
} from "@/redux/slices/canvas/reducer";
import { disposeDataURLS } from "@/redux/slices/canvasMeta/reducer";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";

export const TopPanel = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { setActiveElement } = useActiveElement();
  const { isOpenDownloadModal } = useAppSelector(state => state.canvas);

  const onSaveClick = () => {
    setActiveElement(null);
    dispatch(setIsOpenDownloadModal(true));
  };

  const onOpenClick = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      reader.onloadend = () => {
        if (reader.result) {
          setActiveElement(null);
          dispatch(openFromFile(reader.result));
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const onCloseModal = () => {
    dispatch(setIsOpenDownloadModal(false));
    dispatch(disposeDataURLS());
  };

  return (
    <>
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
      <SaveFileModal open={isOpenDownloadModal} onClose={onCloseModal} />
    </>
  );
};
