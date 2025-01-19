import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";

const Loading = ({ 
  fullScreen = false, 
  size = "default", 
  overlay = false,
  text = "Loading...",
  showText = true,
  className = ""
}) => {
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-8 w-8",
    large: "h-12 w-12",
  };

  const containerClasses = cn(
    "flex flex-col items-center justify-center",
    fullScreen && "h-screen w-screen fixed inset-0",
    !fullScreen && "h-full w-full",
    overlay && "bg-black/50",
    className
  );

  const loaderClass = cn(
    "animate-spin text-primary",
    sizeClasses[size]
  );

  const textClasses = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg",
  };

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={loaderClass} />
        {showText && (
          <p className={cn(
            "text-gray-600 dark:text-gray-300 font-medium",
            textClasses[size]
          )}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

Loading.displayName = "Loading";

Loading.propTypes = {
  fullScreen: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'default', 'large']),
  overlay: PropTypes.bool,
  text: PropTypes.string,
  showText: PropTypes.bool,
  className: PropTypes.string,
};

const LoadingFullScreen = () => (
  <Loading fullScreen overlay size="large" />
);
LoadingFullScreen.displayName = "LoadingFullScreen";

const LoadingInline = () => (
  <Loading size="small" showText={false} />
);
LoadingInline.displayName = "LoadingInline";

const LoadingSection = () => (
  <Loading className="h-64" />
);
LoadingSection.displayName = "LoadingSection";

// Attach variants as static properties
Loading.FullScreen = LoadingFullScreen;
Loading.Inline = LoadingInline;
Loading.Section = LoadingSection;

export default Loading;