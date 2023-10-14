import React, { ChangeEvent, JSX, useEffect, useState } from "react";
import { Button } from "@/components/elements/Button/Button";
import { set } from "@/redux/slices/browser/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Box, TextField, Typography } from "@mui/material";
import Konva from "konva";
import { useDebounce } from "use-debounce";

import Vector2d = Konva.Vector2d;

const presets: Array<{ name: string; resolution: Vector2d }> = [
  {
    name: "720p",
    resolution: {
      x: 1280,
      y: 720
    }
  },
  {
    name: "1080p",
    resolution: {
      x: 1920,
      y: 1080
    }
  },
  {
    name: "1440p",
    resolution: {
      x: 2560,
      y: 1440
    }
  },
  {
    name: "4K",
    resolution: {
      x: 3840,
      y: 2160
    }
  },
  {
    name: "500x500",
    resolution: {
      x: 500,
      y: 500
    }
  },
  {
    name: "1000x1000",
    resolution: {
      x: 1000,
      y: 1000
    }
  },
  {
    name: "2000x2000",
    resolution: {
      x: 2000,
      y: 2000
    }
  }
];

export const ResolutionChanger = (): JSX.Element => {
  const { layerWidth, layerHeight } = useAppSelector(state => state.browser);
  const dispatch = useAppDispatch();
  const [localResolution, setLocalResolution] = useState({
    x: layerWidth,
    y: layerHeight
  });
  const [debouncedResolution] = useDebounce(localResolution, 500);

  useEffect(() => {
    dispatch(
      set({
        layerWidth: debouncedResolution.x,
        layerHeight: debouncedResolution.y
      })
    );
  }, [debouncedResolution]);

  const onChangeX = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLocalResolution(prev => ({
      x: +e.target.value,
      y: prev.y
    }));
  };

  const onChangeY = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLocalResolution(prev => ({
      y: +e.target.value,
      x: prev.x
    }));
  };

  return (
    <Box sx={{ maxWidth: "16rem" }}>
      <Typography variant={"h6"} color={"inherit"} align={"center"}>
        Change resolution
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0.25
        }}>
        {presets.map(preset => (
          <Button
            tabIndex={-1}
            key={preset.name}
            styleType={"default"}
            // sx={{ width: "30px" }}
            onClick={() => {
              setLocalResolution(preset.resolution);
            }}>
            {preset.name}
          </Button>
        ))}
      </Box>
      <Box
        sx={{
          my: 1,
          display: "flex",
          gap: 1
        }}>
        <TextField
          sx={{
            width: 100
          }}
          value={localResolution.x}
          onChange={onChangeX}
          type={"number"}
        />
        <TextField
          sx={{
            width: 100
          }}
          value={localResolution.y}
          onChange={onChangeY}
          type={"number"}
        />
      </Box>
    </Box>
  );
};
