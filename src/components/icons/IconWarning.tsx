import React from "react";
import { IconProps } from "./BaseIconWrapper";
import { IconWrapper } from "./BaseIconWrapper";

type IconWarningProps = Omit<IconProps, "children">;

const IconWarning = React.forwardRef<SVGSVGElement, IconWarningProps>(
  ({ className, color, screenReaderText, size, ...props }, ref) => {
    return (
      <IconWrapper className={className} color={color} size={size} screenReaderText={screenReaderText}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          fill="none"
          viewBox="0 0 16 16"
          ref={ref}
          {...props}
        >
          <g
            fill="currentColor"
            clipPath="url(#a)"
          >
            <path d="M8 5.99756C7.44772 5.99756 7 6.44527 7 6.99756V9.99756C7 10.5498 7.44772 10.9976 8 10.9976 8.55228 10.9976 9 10.5498 9 9.99756V6.99756C9 6.44527 8.55228 5.99756 8 5.99756ZM7 13C7 13.552 7.448 14 8 14 8.552 14 9 13.552 9 13 9 12.448 8.552 12 8 12 7.448 12 7 12.448 7 13Z" />
            <path
              fillRule="evenodd"
              d="M8.44077 1.25907C8.35374 1.09656 8.18435 0.995117 8 0.995117C7.81565 0.995117 7.64626 1.09656 7.55923 1.25907L0.0592257 15.264C-0.0237604 15.419 -0.0192768 15.6061 0.0710345 15.7569C0.161346 15.9077 0.324217 16 0.5 16H15.5C15.6758 16 15.8387 15.9077 15.929 15.7569C16.0193 15.6061 16.0238 15.419 15.9408 15.264L8.44077 1.25907ZM8 2.55423L14.6651 15H1.33495L8 2.55423Z"
              clipRule="evenodd"
            />
          </g>
          <defs>
            <clipPath id="a">
              <path
                fill="#fff"
                d="M0 0H16V16H0z"
              />
            </clipPath>
          </defs>
        </svg>
      </IconWrapper>
    );
  },
);

IconWarning.displayName = "IconWarning";
export default IconWarning;
