import React from "react";
import Spinner from "../Spinner/Spinner";
import "./LoadingOverlay.css";

/**
 * LoadingOverlay wrapper component.
 *
 * @param {Object} props
 * @param {boolean} [props.active=false] - Whether overlay is currently visible.
 * @param {boolean} [props.backdrop=true] - If true, darkens the background with semi-transparent veil.
 * @param {boolean} [props.fullScreen=false] - If true, covers entire viewport (fixed position).
 * @param {string} [props.text] - Optional text displayed below the spinner.
 * @param {React.ReactNode} [props.spinner] - Optional custom Spinner or element.
 * @param {React.ReactNode} [props.children] - Wrapped content.
 * @param {string} [props.className=''] - Custom overlay CSS class.
 */
export const LoadingOverlay = ({
  active = false,
  backdrop = true,
  fullScreen = false,
  text,
  spinner,
  children,
  className = "",
}) => {
  if (!active && !children) {
    return null;
  }

  const backdropClass = backdrop
    ? "shared-loading-backdrop"
    : "shared-loading-transparent";

  const positionClass = fullScreen
    ? "shared-loading-fullscreen"
    : "shared-loading-section";

  const overlayElement = active ? (
    <div
      className={`shared-loading-overlay ${positionClass} ${backdropClass} ${className}`}
      aria-hidden={!active}
    >
      {spinner || <Spinner text={text} color={backdrop ? "#ffffff" : undefined} />}
    </div>
  ) : null;

  // If fullScreen, or if no children, render overlay standalone
  if (fullScreen || !children) {
    return overlayElement;
  }

  // If section wrapper with children
  return (
    <div className="shared-loading-wrapper">
      {children}
      {overlayElement}
    </div>
  );
};

export default LoadingOverlay;
