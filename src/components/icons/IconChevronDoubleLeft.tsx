import React from "react";
import { IconProps } from "./BaseIconWrapper";
import { IconWrapper } from "./BaseIconWrapper";

type IconChevronDoubleLeftProps = Omit<IconProps, "children">;

const IconChevronDoubleLeft = React.forwardRef<SVGSVGElement, IconChevronDoubleLeftProps>(
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
          <path
            fill="currentColor"
            d="M12.0615 14.7772C12.2183 15.007 12.5362 15.0693 12.7716 14.9162 13.0071 14.7632 13.0709 14.4528 12.9141 14.2229L8.66962 8.00005 12.9141 1.77717C13.0709 1.54733 13.0071 1.23693 12.7716 1.08388 12.5362.930826 12.2183.993084 12.0615 1.22293L7.628 7.72293C7.51351 7.89078 7.51351 8.10933 7.628 8.27717L12.0615 14.7772ZM6.51934 14.7772C6.67612 15.007 6.99407 15.0693 7.22951 14.9162 7.46495 14.7632 7.52872 14.4528 7.37195 14.2229L3.12749 8.00005 7.37195 1.77717C7.52872 1.54733 7.46495 1.23693 7.22951 1.08388 6.99407.930826 6.67612.993083 6.51934 1.22293L2.08586 7.72293C1.97138 7.89078 1.97138 8.10933 2.08586 8.27717L6.51934 14.7772Z"
          />
        </svg>
      </IconWrapper>
    );
  },
);

IconChevronDoubleLeft.displayName = "IconChevronDoubleLeft";
export default IconChevronDoubleLeft;
