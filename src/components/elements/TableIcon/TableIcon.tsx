import React, { JSX } from "react";
import { useAppSelector } from "@/redux/store";
import TableFillIcon from "~public/icons/TableFill.svg";
import TableOutlineIcon from "~public/icons/TableOutline.svg";

export const TableIcon = (): JSX.Element => {
  const { fillType } = useAppSelector(state => state.settings.tools.table);

  if (fillType === "fill") return <TableFillIcon />;
  if (fillType === "outline") return <TableOutlineIcon />;
  return <TableFillIcon />;
};
