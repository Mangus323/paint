import { FontOptions } from "@/globals/globals";
import { loadActiveFont, loadFontPreviews } from "./googleAPI/loadFonts";
import { FONT_FAMILY_DEFAULT, Font, FontList } from "./types";
import { getFontId, validatePickerId } from "./utils/ids";

const options = FontOptions;

export default class FontManager {
  private onChange: (font: Font) => void;
  // Name of currently applied font
  private activeFontFamily?: string;
  // Map from font families to font objects
  private fonts: FontList = new Map<string, Font>();
  // Suffix appended to CSS selectors which would have name clashes if multiple font pickers are
  // used on the same site (e.g. "-test" if the picker has pickerId "test" or "" if the picker
  // doesn't have an ID)
  public selectorSuffix: string;

  /**
   * Save relevant options, download the default font, add it to the font list and apply it
   */
  constructor(
    defaultFamily: string = FONT_FAMILY_DEFAULT,
    onChange: (font: Font) => void = (): void => {}
  ) {
    // Validate pickerId parameter
    validatePickerId(options.pickerId);
    this.selectorSuffix = options.pickerId ? `-${options.pickerId}` : "";
    this.onChange = onChange;
    this.addFont(defaultFamily, false);
    this.setActiveFont(defaultFamily, false);
  }

  /**
   * Fetch list of all fonts from Google Fonts API, filter it according to the class parameters and
   * save them to the font map
   */
  public async init(): Promise<FontList> {
    const response = await fetch(`${window.location.origin}/api/fonts`);
    const fonts = await response.json();

    for (let i = 0; i < fonts.length; i += 1) {
      const font = fonts[i];
      if (!this.fonts.has(font[0])) {
        this.fonts.set(font[0], font[1]);
      }
    }
    // Download previews for all fonts in list except for default font (its full font has already
    // been downloaded)
    const fontsToLoad = new Map(this.fonts);
    if (this.activeFontFamily) fontsToLoad.delete(this.activeFontFamily);
    loadFontPreviews(fontsToLoad, this.selectorSuffix);
    return this.fonts;
  }

  /**
   * Return font map
   */
  public getFonts(): FontList {
    return this.fonts;
  }

  /**
   * Add a new font to the font map and download its preview characters
   */
  public addFont(fontFamily: string, downloadPreview = true): void {
    const font: Font = {
      family: fontFamily,
      id: getFontId(fontFamily)
    };
    this.fonts.set(fontFamily, font);
    if (downloadPreview) {
      const fontMap: FontList = new Map<string, Font>();
      fontMap.set(fontFamily, font);
      loadFontPreviews(fontMap, this.selectorSuffix);
    }
  }

  /**
   * Remove the specified font from the font map
   */
  public removeFont(fontFamily: string): void {
    this.fonts.delete(fontFamily);
  }

  /**
   * Return the font object of the currently active font
   */
  public getActiveFont() {
    return (
      (this.activeFontFamily && this.fonts.get(this.activeFontFamily)) || ""
    );
  }

  /**
   * Set the specified font as the active font and download it
   */
  public setActiveFont(fontFamily: string, runOnChange = true): void {
    const previousFontFamily = this.activeFontFamily;
    const activeFont = this.fonts.get(fontFamily);
    if (!activeFont) {
      throw Error(
        `Cannot update active font: "${fontFamily}" is not in the font list`
      );
    }

    this.activeFontFamily = fontFamily;
    loadActiveFont(
      activeFont,
      previousFontFamily || "",
      this.selectorSuffix
    ).then((): void => {
      if (runOnChange) {
        this.onChange(activeFont);
      }
    });
  }

  /**
   * Update the onChange function (executed when changing the active font)
   */
  public setOnChange(onChange: (font: Font) => void): void {
    this.onChange = onChange;
  }
}
