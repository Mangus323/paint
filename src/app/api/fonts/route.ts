import { FontOptions } from "@/globals/globals";
import { Font, Script, getFontId } from "@/utils/FontManager";
import { NextResponse } from "next/server";

const LIST_BASE_URL = "https://www.googleapis.com/webfonts/v1/webfonts";
const options = FontOptions;

interface FontResponse extends Font {
  subsets: Script[];
}

const isExclude = (fontFamily: string) => {
  for (let i = 0; i < options.exclude.length; i++) {
    if (fontFamily.toLowerCase().includes(options.exclude[i])) {
      return true;
    }
  }
  return false;
};

/**
 * Fetch the list of all available fonts from the Google Fonts API
 */
export async function GET(req, res) {
  const apiKey = process.env.GOOGLE_KEY as string;

  try {
    const url = new URL(LIST_BASE_URL);
    url.searchParams.append("sort", "popularity");
    url.searchParams.append("key", apiKey);

    const googleFonts = await fetch(url.href);
    const json = await googleFonts.json();
    const fonts = json.items.map((fontOriginal: FontResponse): Font => {
      const { family, subsets, ...others } = fontOriginal;
      return {
        ...others,
        family,
        id: getFontId(family),
        scripts: subsets
      };
    });
    const response = new Map();
    for (let i = 0; i < fonts.length; i += 1) {
      const font: Font = fonts[i];
      if (response.size >= options.limit) break;

      if (isExclude(font.family)) continue;

      if (
        (options.families.length === 0 ||
          options.families.includes(font.family)) &&
        (options.categories.length === 0 ||
          (font.category && options.categories.includes(font.category))) &&
        options.scripts.every(
          script => font.scripts && font.scripts.includes(script)
        ) &&
        options.variants.every(
          variant => font.variants && font.variants.includes(variant)
        ) &&
        options.filter(font)
      ) {
        response.set(font.family, font);
      }
    }

    return new NextResponse(JSON.stringify([...response]), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new NextResponse(e as any, {
      status: 500
    });
  }
}
