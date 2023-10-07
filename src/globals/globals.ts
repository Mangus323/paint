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
  exclude: ["icons", "material"]
};

export const defaultColors = [
  "#FFFFFF",
  "#000000",
  "#ED7D31",
  "#4472C4",
  "#70AD47",
  "#FFC000",
  "#A5A5A5",
  "#F24C3D",
  "#22A699",
  "#6554AF"
];
