import React from "react";
import { IconProps } from "./BaseIconWrapper";
import { IconWrapper } from "./BaseIconWrapper";

type IconBinderProps = Omit<IconProps, "children">;

const IconBinder = React.forwardRef<SVGSVGElement, IconBinderProps>(
  ({ className, color, screenReaderText, size, ...props }, ref) => {
    return (
      <IconWrapper
        className={className}
        color={color}
        size={size}
        screenReaderText={screenReaderText}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          fill="none"
          viewBox="0 0 16 16"
          ref={ref}
          {...props}
        >
          <path
            fill="currentColor"
            d="M4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5Z"
          />
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M1 4V12C1 13.6569 2.34315 15 4 15H13C14.1046 15 15 14.1046 15 13V4C15 2.34315 13.6569 1 12 1H4C2.34315 1 1 2.34315 1 4ZM12 2H4C2.89543 2 2 2.89543 2 4V7H14V4C14 2.89543 13.1046 2 12 2ZM14 13V8H2V12C2 13.1046 2.89543 14 4 14H13C13.5523 14 14 13.5523 14 13Z"
            clipRule="evenodd"
          />
        </svg>
      </IconWrapper>
    );
  },
);

IconBinder.displayName = "IconBinder";
export default IconBinder;
