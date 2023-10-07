import React, {
  ChangeEvent,
  JSX,
  useCallback,
  useEffect,
  useState
} from "react";
import { useGlobalEventListener } from "@/hooks/useGlobalEventListener";
import { useAppSelector } from "@/redux/store";
import { Box, TextField, Typography } from "@mui/material";
import { colord } from "colord";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  onSetColor: (color: string) => void;
}

export const ColorPicker = (props: ColorPickerProps): JSX.Element => {
  const { onSetColor } = props;
  const { selectedColor } = useAppSelector(state => state.settings);
  const [colorText, setColorText] = useState(selectedColor.slice(1));
  const [isTextFocused, setIsTextFocused] = useState(false);

  const onChangeColor = (color: string) => {
    onSetColor(color.toUpperCase());
  };

  const onChangeColorText = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    if (value.length > 6) return;

    if (value.length > colorText.length) {
      const last = value[value.length - 1];
      if (!last.match(/[\da-fA-F]/)) return;
    }

    setColorText(value);
    onChangeColor(convertTextColor(value));
  };

  const onBlurColorText = () => {
    setColorText(selectedColor.slice(1));
  };

  const clipboardPaste = useCallback((_, e: Event) => {
    e.stopPropagation();
    const clipboardData = (e as ClipboardEvent).clipboardData;
    if (!clipboardData) return;
    const text = clipboardData.getData("text/plain");
    if (!text) return false;

    const color = convertRaw(text);
    setColorText(color.slice(1));
    onChangeColor(color);
  }, []);

  useEffect(() => {
    if (!isTextFocused) setColorText(selectedColor.slice(1));
  }, [selectedColor]);

  useGlobalEventListener("window", "paste", clipboardPaste, null, true);

  return (
    <Box>
      <Typography variant={"h6"} color={"inherit"} align={"center"}>
        Color picker
      </Typography>
      <Box
        sx={{
          marginBottom: 1,
          "& .react-colorful__saturation": {
            borderRadius: 0,
            boxShadow: "unset"
          },
          "& .react-colorful__last-control": {
            borderRadius: 0
          },
          "& .react-colorful__pointer": {
            width: 24,
            height: 24
          }
        }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            marginBottom: 1,
            position: "relative"
          }}>
          <Typography
            color={"inherit"}
            variant={"subtitle1"}
            component={"p"}
            sx={{ position: "absolute", top: "-1px" }}>
            #
          </Typography>
          <TextField
            sx={{
              "& > div": {
                backgroundColor: "transparent !important"
              },
              "& > div > input": { paddingLeft: 1.5, paddingTop: "unset" }
            }}
            variant={"filled"}
            onFocus={() => setIsTextFocused(true)}
            onBlurCapture={() => setIsTextFocused(false)}
            value={colorText}
            onChange={onChangeColorText}
            onBlur={onBlurColorText}
            spellCheck={false}
          />
        </Box>
        <Box
          sx={{
            border: "2px solid var(--teal-300)",
            borderRadius: 1
          }}>
          <HexColorPicker color={selectedColor} onChange={onChangeColor} />
        </Box>
      </Box>
    </Box>
  );
};

const convertRaw = (raw: string) => {
  // RGBA
  let numbers = raw.split(",");
  if (numbers.length === 4) numbers.pop();
  if (numbers.length === 3) {
    if (numbers[0].includes("(")) numbers[0] = numbers[0].split("(")[1];
    if (numbers[2].includes(")")) numbers[2] = numbers[2].split(")")[0];
    return colord(`rgb(${numbers.join(",")})`).toHex();
  }

  // Hex
  if (raw[0] === "#") return convertTextColor(raw.slice(1));
  if (raw.match(/^[\da-fA-F]+/)) return convertTextColor(raw);

  return colord(`rgb(${numbers.join(",")})`).toHex();
};

const convertTextColor = (text: string) => {
  text = text.toUpperCase();
  if (text.length === 0) return "#000000";
  if (text.length <= 3) return "#" + text.repeat(6 / text.length);
  if (text.length < 6) return "#" + text + "0".repeat(6 - text.length);
  if (text.length > 6) return "#" + text.slice(0, 6);

  return "#" + text;
};
