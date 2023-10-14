import { useEffect, useState } from "react";
import { setFonts } from "@/redux/slices/settings/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { FontManager } from "@/utils/FontManager";

type LoadingStatus = "loading" | "finished" | "error";

export const useFontManager = (onChange: any, fontFamily: string) => {
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("loading");
  const dispatch = useAppDispatch();
  const { fonts } = useAppSelector(state => state.settings);
  const [fontManager] = useState<FontManager>(
    new FontManager(fontFamily, onChange)
  );

  useEffect(() => {
    if (loadingStatus !== "finished") return;
    const localFonts = Array.from(fontManager.getFonts().values());
    // alphabet
    localFonts.sort((font1, font2) => font1.family.localeCompare(font2.family));
    dispatch(setFonts(localFonts));
  }, [fontManager, loadingStatus]);

  useEffect(() => {
    if (onChange) fontManager.setOnChange(onChange);
  }, [onChange]);

  useEffect(() => {
    fontManager
      .init()
      .then((): void => {
        setLoadingStatus("finished");
      })
      .catch((err: Error): void => {
        // On error: Log error message
        setLoadingStatus("error");
        console.error("Error trying to fetch the list of available fonts");
        console.error(err);
      });
  }, []);

  const setActiveFontFamily = (fontId: string) => {
    let font = fonts.find(font => font.id === fontId);
    if (font) {
      fontManager.setActiveFont(font.family);
      if (onChange) onChange(font);
    }
  };

  return {
    fontManager,
    fonts: loadingStatus === "finished" ? fonts : [],
    setActiveFontFamily
  };
};
