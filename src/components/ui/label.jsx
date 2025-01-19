import { cn } from "@/lib/utils"
import * as LabelPrimitive from "@radix-ui/react-label"
import PropTypes from "prop-types"
import * as React from "react"

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))

Label.displayName = "Label"

Label.propTypes = {
  className: PropTypes.string
}

export { Label }
