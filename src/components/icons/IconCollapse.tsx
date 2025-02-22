import React from "react";
import { IconProps } from "./BaseIconWrapper";
import { IconWrapper } from "./BaseIconWrapper";

type IconCollapseProps = Omit<IconProps, "children">;

const IconCollapse = React.forwardRef<SVGSVGElement, IconCollapseProps>(
  ({ className, color, screenReaderText, size, ...props }, ref) => {
    return (
      <IconWrapper className={className} color={color} size={size} screenReaderText={screenReaderText}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 16 16"
          ref={ref}
          {...props}
        >
          <path
            fill="currentColor"
            d="M5.01228.5C5.01228.223858 4.78842 0 4.51228 0 4.23613 0 4.01227.223858 4.01227.5V3.99609H.501953C.225811 3.99609.00195312 4.21994.00195312 4.49609.00195312 4.77223.225811 4.99609.501953 4.99609H4.51228C4.78842 4.99609 5.01228 4.77223 5.01228 4.49609V.5ZM11.9912.5C11.9912.223858 11.7674 0 11.4912 0 11.2151 0 10.9912.223858 10.9912.5V4.49609C10.9912 4.77223 11.2151 4.99609 11.4912 4.99609H15.4956C15.7717 4.99609 15.9956 4.77223 15.9956 4.49609 15.9956 4.21994 15.7717 3.99609 15.4956 3.99609H11.9912V.5ZM10.9971 11.4888C10.9971 11.2126 11.2209 10.9888 11.4971 10.9888H15.4996C15.7757 10.9888 15.9996 11.2126 15.9996 11.4888 15.9996 11.7649 15.7757 11.9888 15.4996 11.9888H11.9971V15.4932C11.9971 15.7693 11.7732 15.9932 11.4971 15.9932 11.2209 15.9932 10.9971 15.7693 10.9971 15.4932V11.4888ZM.501953 10.9888C.225811 10.9888.00195312 11.2126.00195312 11.4888.00195312 11.7649.225811 11.9888.501953 11.9888H4.00283V15.504C4.00283 15.7801 4.22668 16.004 4.50283 16.004 4.77897 16.004 5.00283 15.7801 5.00283 15.504V11.4888C5.00283 11.2126 4.77897 10.9888 4.50283 10.9888H.501953Z"
          />
        </svg>
      </IconWrapper>
    );
  },
);

IconCollapse.displayName = "IconCollapse";
export default IconCollapse;
