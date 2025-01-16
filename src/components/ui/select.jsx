import { cn } from "@/lib/utils";
import PropTypes from "prop-types";
import * as React from "react";

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

Select.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  props: PropTypes.object,
};

Select.defaultProps = {
  className: "",
};

export { Select };
