import React, { JSX } from "react";
import { Button } from "@/components/elements/Button/Button";
import { FileUploader } from "@/components/elements/FileUplaoder/FileUploader";
import { openFromFile, setIsDownloading } from "@/redux/slices/canvas/reducer";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import s from "./index.module.scss";

export const TopPanel = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();

  const onSaveClick = () => {
    dispatch(setIsDownloading(true));
  };

  const onOpenClick = ({ target }) => {
    const reader = new FileReader();
    if (target.files && target.files[0]) {
      const file = target.files[0];

      reader.onloadend = () => {
        if (reader.result) dispatch(openFromFile(reader.result));
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <section className={s.container}>
      <FileUploader onChange={onOpenClick}>Open</FileUploader>
      <Button styleType={"default"} onClick={onSaveClick}>
        Save
      </Button>
    </section>
  );
};
