import React, { useState } from "react";
import "./Header.css";

const DEFAULT_NAV_LINKS = [
  { label: "Inicio", href: "#!" },
  { label: "Proyectos", href: "#!" },
];

/**
 * Reusable Header component with responsive hamburger menu.
 *
 * @param {Object} props
 * @param {string|React.ReactNode} [props.title="React App"] - Brand title/name.
 * @param {string|React.ReactNode} [props.logo] - Brand logo image URL or SVG node.
 * @param {Array<{label: string, href: string, onClick?: Function, active?: boolean, target?: string}>} [props.navLinks] - Navigation items.
 * @param {React.ReactNode} [props.actions] - Right-hand side action elements (buttons, toggles).
 * @param {'teal'|'dark'|'primary'|'slate'} [props.variant="teal"] - Color variant theme.
 * @param {string} [props.className=""] - Extra CSS class.
 * @param {React.ReactNode} [props.children] - Custom content overriding/extending default navbar.
 */
export const Header = ({
  title = "React App",
  logo,
  navLinks = DEFAULT_NAV_LINKS,
  actions,
  variant = "teal",
  className = "",
  children,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLinkClick = (link, event) => {
    if (link.onClick) {
      link.onClick(event);
    }
    setIsMenuOpen(false);
  };

  const themeClass = `shared-header-${variant}`;

  return (
    <header className={`shared-header ${themeClass} ${className}`}>
      <div className="shared-header-container">
        {/* Brand Area */}
        <a href="#!" className="shared-header-brand">
          {logo && typeof logo === "string" ? (
            <img src={logo} alt="Logo" className="shared-header-logo" />
          ) : (
            logo
          )}
          {typeof title === "string" ? (
            <h1 className="shared-header-title">{title}</h1>
          ) : (
            title
          )}
        </a>

        {/* Children Override or Default Navigation */}
        {children || (
          <>
            {/* Desktop Navigation */}
            {navLinks && navLinks.length > 0 && (
              <nav aria-label="Navegación principal">
                <ul className="shared-header-nav-desktop">
                  {navLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href || "#!"}
                        target={link.target}
                        rel={link.target === "_blank" ? "noreferrer" : undefined}
                        className={`shared-header-nav-link ${
                          link.active ? "active" : ""
                        }`}
                        onClick={(e) => handleLinkClick(link, e)}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* Actions Area */}
            {actions && <div className="shared-header-actions">{actions}</div>}

            {/* Hamburger Button (Mobile) */}
            {navLinks && navLinks.length > 0 && (
              <button
                type="button"
                className={`shared-header-hamburger ${isMenuOpen ? "open" : ""}`}
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={isMenuOpen}
              >
                <span className="shared-header-hamburger-line" />
                <span className="shared-header-hamburger-line" />
                <span className="shared-header-hamburger-line" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Mobile Drawer */}
      {!children && navLinks && navLinks.length > 0 && (
        <div className={`shared-header-drawer ${isMenuOpen ? "open" : ""}`}>
          <ul className="shared-header-nav-mobile">
            {navLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href || "#!"}
                  target={link.target}
                  rel={link.target === "_blank" ? "noreferrer" : undefined}
                  className={`shared-header-nav-link ${
                    link.active ? "active" : ""
                  }`}
                  onClick={(e) => handleLinkClick(link, e)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
