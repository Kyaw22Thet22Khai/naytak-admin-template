import { Card } from "naytak-react-ui";
import { APP_NAME } from "../../constants/app";
import { ThemeToggle } from "../../components/themeToggle";
import logo from "../../assets/logo.svg";
import "./auth.css";

/** Centered auth shell shared by the Login and Register pages. */
export function AuthLayout({ title, children, footer }) {
  return (
    <div className="auth">
      <div className="auth__theme-toggle">
        <ThemeToggle />
      </div>
      <Card className="auth-card">
        <div className="auth-card__brand">
          <div className="auth-card__logo">
            <img src={logo} alt={`${APP_NAME} logo`} />
          </div>
          <div className="auth-card__appname">{APP_NAME}</div>
        </div>
        <h2 className="auth-card__title">{title}</h2>
        {children}
        {footer && <div className="auth-card__footer">{footer}</div>}
      </Card>
    </div>
  );
}
