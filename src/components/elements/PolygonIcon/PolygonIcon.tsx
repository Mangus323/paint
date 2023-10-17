import React, { JSX } from "react";
import { useAppSelector } from "@/redux/store";
import Polygon3Icon from "~public/icons/Polygon3.svg";
import Polygon5Icon from "~public/icons/Polygon5.svg";
import Polygon6Icon from "~public/icons/Polygon6.svg";
import Polygon8Icon from "~public/icons/Polygon8.svg";

export const PolygonIcon = (): JSX.Element => {
  const { sides } = useAppSelector(state => state.settings.tools.polygon);

  if (sides === 3) return <Polygon3Icon />;
  if (sides === 5) return <Polygon5Icon />;
  if (sides === 6) return <Polygon6Icon />;
  if (sides === 8) return <Polygon8Icon />;
  return <Polygon3Icon />;
};
