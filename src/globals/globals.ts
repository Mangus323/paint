import { Options } from "@/utils/FontManager";

const sidebarDimension = {
  width: 50,
  height: 30
};

const scrollbarPadding = 4;

export { sidebarDimension, scrollbarPadding as sp };

export const FontOptions: Options = {
  pickerId: "",
  families: [],
  categories: [],
  scripts: ["latin"],
  variants: ["regular"],
  filter: () => true,
  limit: 50,
  exclude: ["icons"]
};
