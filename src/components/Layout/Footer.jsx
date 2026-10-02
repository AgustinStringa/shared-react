import React from "react";
import "./Footer.css";

const DEFAULT_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/AgustinStringa",
    target: "_blank",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/agustin-stringa-01718a212/",
    target: "_blank",
  },
];

const DEFAULT_AUTHOR = {
  name: "Agustín Stringa",
  url: "https://github.com/AgustinStringa",
};

/**
 * Reusable Footer component for shared library.
 *
 * @param {Object} props
 * @param {string|React.ReactNode} [props.title="React Workspace"] - Footer title or app name.
 * @param {string|React.ReactNode} [props.description] - Description text.
 * @param {{name: string, url: string}} [props.author] - Author credits.
 * @param {Array<{label: string, href: string, target?: string}>} [props.links=[]] - Additional or custom links.
 * @param {boolean} [props.includeDefaultLinks=true] - Whether to include default personal links (GitHub, LinkedIn).
 * @param {string} [props.copyright] - Custom copyright line.
 * @param {'teal'|'dark'|'slate'} [props.variant="teal"] - Color variant theme.
 * @param {string} [props.className=""] - Extra CSS class.
 * @param {React.ReactNode} [props.children] - Custom content overriding default layout.
 */
export const Footer = ({
  title = "React Workspace",
  description = "Colección de proyectos desarrollados con React y Vite.",
  author = DEFAULT_AUTHOR,
  links = [],
  includeDefaultLinks = true,
  copyright,
  variant = "teal",
  className = "",
  children,
}) => {
  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} ${title}. Todos los derechos reservados.`;
  const themeClass = `shared-footer-${variant}`;

  const finalLinks = includeDefaultLinks
    ? [...links, ...DEFAULT_LINKS]
    : links;

  return (
    <footer className={`shared-footer ${themeClass} ${className}`}>
      {children || (
        <>
          <div className="shared-footer-container">
            {/* Left Column: Brand & Description */}
            <div>
              {typeof title === "string" ? (
                <h2 className="shared-footer-title">{title}</h2>
              ) : (
                title
              )}
              {description && (
                <p className="shared-footer-description">{description}</p>
              )}
            </div>

            {/* Right Column: Links */}
            {finalLinks && finalLinks.length > 0 && (
              <div>
                <h3 className="shared-footer-links-title">Enlaces</h3>
                <ul className="shared-footer-links-list">
                  {finalLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        target={link.target || "_blank"}
                        rel={
                          link.target === "_blank" ? "noreferrer" : undefined
                        }
                        className="shared-footer-link"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Bottom Bar: Copyright & Author */}
          <div className="shared-footer-bottom">
            <span>{copyright || defaultCopyright}</span>
            {author && author.name && (
              <span>
                Desarrollado por{" "}
                <a
                  href={author.url || "#!"}
                  target="_blank"
                  rel="noreferrer"
                  className="shared-footer-author-link"
                >
                  {author.name}
                </a>
              </span>
            )}
          </div>
        </>
      )}
    </footer>
  );
};

export default Footer;
