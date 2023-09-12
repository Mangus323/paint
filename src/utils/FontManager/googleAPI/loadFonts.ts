import { FontOptions } from "@/globals/globals";
import { applyActiveFont, applyFontPreview } from "../fontDOM/declarations";
import extractFontStyles from "../fontDOM/extractFontStyles";
import {
  createStylesheet,
  fillStylesheet,
  setStylesheetType,
  stylesheetExists
} from "../fontDOM/stylesheets";
import { Font, FontList, Script, Variant } from "../types";

const FONT_BASE_URL = "https://fonts.googleapis.com/css";

const { scripts, variants } = FontOptions;

/**
 * Get the Google Fonts stylesheet for the specified font (in the specified scripts and variants,
 * only the characters needed for creating the font previews), add the necessary CSS declarations to
 * apply them and add the fonts' stylesheets to the document head
 */
export async function loadFontPreviews(
  fonts: FontList,
  selectorSuffix: string
): Promise<void> {
  const fontsArray: Font[] = Array.from(fonts.values());
  const fontsToFetch = fontsArray
    .filter(font => !stylesheetExists(font.id))
    .map((font: Font) => font.id);
  fontsToFetch.forEach(fontId => createStylesheet(fontId, true));
  const response = await getStylesheet(fontsArray, scripts, variants, true);
  const styles = await response.text();
  const fontStyles = extractFontStyles(styles);
  fontsArray.forEach((font): void => {
    applyFontPreview(font, selectorSuffix);
    if (fontsToFetch.includes(font.id)) {
      if (!(font.id in fontStyles)) {
        // console.error(
        //   `Missing styles for font "${font.family}" (fontId "${font.id}") in Google Fonts response`
        // );
        return;
      }
      fillStylesheet(font.id, fontStyles[font.id]);
    }
  });
}

/**
 * Get the Google Fonts stylesheet for the specified font (in the specified scripts and variants),
 * add the necessary CSS declarations to apply it and add the font's stylesheet to the document head
 */
export async function loadActiveFont(
  font: Font,
  previousFontFamily: string,
  selectorSuffix: string
): Promise<void> {
  if (stylesheetExists(font.id, false)) {
    applyActiveFont(font, previousFontFamily, selectorSuffix);
  } else {
    if (stylesheetExists(font.id, true)) setStylesheetType(font.id, false);
    else createStylesheet(font.id, false);
    const response = await getStylesheet([font], scripts, variants, false);
    const fontStyle = await response.text();
    applyActiveFont(font, previousFontFamily, selectorSuffix);
    fillStylesheet(font.id, fontStyle);
  }
}

/**
 * Return URL to the Google Fonts stylesheet for the specified font families and variants.
 * If previewsOnly is set to true, only the characters contained in the font family names are
 * included
 */
async function getStylesheet(
  fonts: Font[],
  scripts: Script[],
  variants: Variant[],
  previewsOnly: boolean
): Promise<Response> {
  const url = new URL(FONT_BASE_URL);
  const variantsStr = variants.join(",");
  const familiesStr = fonts.map(
    (font): string => `${font.family}:${variantsStr}`
  );
  url.searchParams.append("family", familiesStr.join("|"));
  url.searchParams.append("subset", scripts.join(","));
  if (previewsOnly) {
    const familyNamesConcat = fonts.map((font): string => font.family).join("");
    const downloadChars = familyNamesConcat
      .split("")
      .filter((char, pos, self): boolean => self.indexOf(char) === pos)
      .join("");
    url.searchParams.append("text", downloadChars);
  }
  url.searchParams.append("font-display", "swap");
  return fetch(url.href);
}
