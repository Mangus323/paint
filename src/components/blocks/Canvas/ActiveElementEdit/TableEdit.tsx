import React, { Fragment, JSX, MouseEvent } from "react";
import { SimpleButton } from "@/components/elements/Button/Button";
import { tp } from "@/globals/globals";
import { useActiveElement } from "@/hooks/useActiveElement";
import { ITable } from "@/types/canvas";
import { Box, Tooltip } from "@mui/material";
import MinusIcon from "~public/icons/Minus.svg";
import PlusIcon from "~public/icons/Plus.svg";

const buttonSize = 20;

interface TableEditProps {
  visible: boolean;
}

export const TableEdit = ({ visible }: TableEditProps): JSX.Element => {
  const { activeElement, setActiveElement } = useActiveElement();
  const element = activeElement as ITable;
  const { columns, rows } = element;
  const onAddColumn = (e: MouseEvent) => {
    if (e.shiftKey) {
      setActiveElement({
        ...element,
        width: (element.width / columns) * (columns + 1),
        columns: columns + 1
      });
      return;
    }
    setActiveElement({
      ...element,
      columns: columns + 1
    });
  };

  const onRemoveColumn = (e: MouseEvent) => {
    if (columns === 1) return;

    if (e.shiftKey) {
      setActiveElement({
        ...element,
        width: (element.width / columns) * (columns - 1),
        columns: columns - 1
      });
      return;
    }

    setActiveElement({
      ...element,
      columns: columns - 1
    });
  };

  const onAddRow = (e: MouseEvent) => {
    if (e.shiftKey) {
      setActiveElement({
        ...element,
        height: (element.height / rows) * (rows + 1),
        rows: rows + 1
      });
      return;
    }

    setActiveElement({
      ...element,
      rows: rows + 1
    });
  };

  const onRemoveRow = (e: MouseEvent) => {
    if (rows === 1) return;

    if (e.shiftKey) {
      setActiveElement({
        ...element,
        height: (element.height / rows) * (rows - 1),
        rows: rows - 1
      });
      return;
    }

    setActiveElement({
      ...element,
      rows: rows - 1
    });
  };

  if (!activeElement || activeElement.tool !== "table") return <Fragment />;

  return (
    <>
      <Box
        style={{ visibility: visible ? "visible" : "hidden" }}
        sx={{
          position: "absolute",
          left: element.width + tp - 2,
          top: element.height / 2 - buttonSize * 2 + 2
        }}>
        <Tooltip title={"Add column"}>
          <SimpleButton onClick={onAddColumn}>
            <PlusIcon />
          </SimpleButton>
        </Tooltip>
        <Tooltip title={"Remove column"}>
          <SimpleButton onClick={onRemoveColumn}>
            <MinusIcon />
          </SimpleButton>
        </Tooltip>
      </Box>
      <Box
        style={{ visibility: visible ? "visible" : "hidden" }}
        sx={{
          position: "absolute",
          display: "flex",
          top: element.height + tp * 3 - 1,
          left: element.width / 2 - buttonSize * 2 - 8
        }}>
        <Tooltip title={"Add row"}>
          <SimpleButton onClick={onAddRow}>
            <PlusIcon />
          </SimpleButton>
        </Tooltip>
        <Tooltip title={"Remove row"}>
          <SimpleButton onClick={onRemoveRow}>
            <MinusIcon />
          </SimpleButton>
        </Tooltip>
      </Box>
    </>
  );
};
