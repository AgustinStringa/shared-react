import React from "react";
import "./Spinner.css";

/**
 * Universal customizable Spinner component for shared library.
 *
 * @param {Object} props
 * @param {'ring'|'chase'|'cubes'|'image'} [props.variant='ring'] - Spinner visual style variant.
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Preset size.
 * @param {string} [props.color='#3b82f6'] - Main spinner color.
 * @param {string} [props.image] - Optional image URL or imported asset.
 * @param {'spin'|'pulse'|'none'} [props.imageAnimation='spin'] - Animation style for image spinner.
 * @param {string} [props.text] - Optional text label underneath.
 * @param {string} [props.className=''] - Custom CSS class.
 * @param {string} [props.ariaLabel='Cargando...'] - Accessibility label.
 */
export const Spinner = ({
  variant = "ring",
  size = "md",
  color,
  image,
  imageAnimation = "spin",
  text,
  className = "",
  ariaLabel = "Cargando...",
}) => {
  // Inline style override if a custom color is passed
  const customColorStyle = color
    ? {
        "--shared-spinner-color": color,
        "--shared-spinner-track-color": `${color}33`,
      }
    : {};

  const sizeClass = `shared-spinner-${size}`;

  const renderSpinnerGraphic = () => {
    // If an image is provided, automatically use image variant
    if (image || variant === "image") {
      const animClass =
        imageAnimation === "spin"
          ? "shared-spinner-img-spin"
          : imageAnimation === "pulse"
          ? "shared-spinner-img-pulse"
          : "";

      return (
        <img
          src={image}
          alt={ariaLabel}
          className={`shared-spinner-img ${sizeClass} ${animClass}`}
        />
      );
    }

    switch (variant) {
      case "chase":
        return (
          <div className="shared-sk-chase">
            <div className="shared-sk-chase-dot" />
            <div className="shared-sk-chase-dot" />
            <div className="shared-sk-chase-dot" />
            <div className="shared-sk-chase-dot" />
            <div className="shared-sk-chase-dot" />
            <div className="shared-sk-chase-dot" />
          </div>
        );

      case "cubes":
        return (
          <div className="shared-sk-cubes">
            <div className="shared-sk-cube1" />
            <div className="shared-sk-cube2" />
          </div>
        );

      case "ring":
      default:
        return <div className={`shared-spinner-ring ${sizeClass}`} />;
    }
  };

  return (
    <div
      className={`shared-spinner-container ${className}`}
      style={customColorStyle}
      role="status"
      aria-label={ariaLabel}
      aria-busy="true"
    >
      {renderSpinnerGraphic()}
      {text && <span className="shared-spinner-text">{text}</span>}
    </div>
  );
};

export default Spinner;
