import React, { JSX } from "react";
import { useAppSelector } from "@/redux/store";

export const TextIcon = (): JSX.Element => {
  const { fontStyle, textDecoration } = useAppSelector(state => state.settings)
    .tools.text;

  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2_17)">
        {textDecoration.includes("underline") && <Underline />}
        {textDecoration.includes("line-through") && <LineThrough />}
        {!fontStyle && <TextBaseMedium />}
        {fontStyle === "bold" && <TextBaseBold />}
        {fontStyle === "italic" && <TextBaseItalic />}
        {fontStyle === "italic bold" && <TextBaseItalicBold />}
      </g>
      <defs>
        <clipPath id="clip0_2_17">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const TextBaseMedium = () => (
  <path
    d="M3.8267 14H1.49716L6.73153 -0.545455H9.26705L14.5014 14H12.1719L8.05966
    2.09659H7.94602L3.8267 14ZM4.21733 8.30398H11.7741V10.1506H4.21733V8.30398Z"
    fill="black"
  />
);

const TextBaseBold = () => (
  <path
    d="M4.77131 14H1.47585L6.49716 -0.545455H10.4602L15.4744 14H12.179L8.53551
    2.77841H8.42188L4.77131 14ZM4.56534 8.28267H12.3494V10.6832H4.56534V8.28267Z"
    fill="black"
  />
);

const TextBaseItalic = () => (
  <path
    d="M2.91761 14H0.588068L8.23722 -0.545455H10.7727L13.5923 14H11.2628L9.1392
    2.09659H9.02557L2.91761 14ZM4.25284 8.30398H11.8097L11.4972 10.1506H3.94034L4.25284 8.30398Z"
    fill="black"
  />
);

const TextBaseItalicBold = () => (
  <path
    d="M3.86222 14H0.566761L8.00284 -0.545455H11.9659L14.5653 14H11.2699L9.50142
    2.77841H9.38778L3.86222 14ZM4.61506 8.28267H12.3991L11.9872 10.6832H4.20312L4.61506 8.28267Z"
    fill="black"
  />
);

const Underline = () => (
  <line x1="1" y1="15.5" x2="15" y2="15.5" stroke="black" />
);

const LineThrough = () => (
  <line x1="1" y1="7" x2="15" y2="7" stroke="black" strokeWidth="2" />
);
