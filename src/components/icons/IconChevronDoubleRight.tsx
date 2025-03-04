import React from "react";
import { IconProps } from "./BaseIconWrapper";
import { IconWrapper } from "./BaseIconWrapper";

type IconChevronDoubleRightProps = Omit<IconProps, "children">;

const IconChevronDoubleRight = React.forwardRef<SVGSVGElement, IconChevronDoubleRightProps>(
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
            d="M3.91421 1.21812C3.75829.99006 3.44677.931408 3.21841 1.08711 2.99005 1.24282 2.93132 1.55392 3.08723 1.78198L7.3383 8.00005 3.08723 14.2181C2.93132 14.4462 2.99005 14.7573 3.21841 14.913 3.44677 15.0687 3.75829 15.01 3.91421 14.782L8.35802 8.28198C8.47426 8.11195 8.47426 7.88815 8.35802 7.71812L3.91421 1.21812ZM9.469 1.21812C9.31309.990059 9.00157.931407 8.77321 1.08711 8.54484 1.24282 8.48611 1.55392 8.64203 1.78198L12.8931 8.00005 8.64203 14.2181C8.48611 14.4462 8.54485 14.7573 8.77321 14.913 9.00157 15.0687 9.31309 15.01 9.469 14.782L13.9128 8.28198C14.0291 8.11195 14.0291 7.88815 13.9128 7.71812L9.469 1.21812Z"
          />
        </svg>
      </IconWrapper>
    );
  },
);

IconChevronDoubleRight.displayName = "IconChevronDoubleRight";
export default IconChevronDoubleRight;
