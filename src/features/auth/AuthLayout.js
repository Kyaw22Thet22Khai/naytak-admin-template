import { Card } from "naytak-react-ui";
import { APP_NAME } from "../../constants/app";
import logo from "../../assets/logo.svg";
import "./auth.css";

/** Centered auth shell shared by the Login and Register pages. */
export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <Card className="auth-card">
        <div className="auth-card__brand">
          <div className="auth-card__logo">
            <img src={logo} alt={`${APP_NAME} logo`} />
          </div>
          <div className="auth-card__appname">{APP_NAME}</div>
        </div>
        <h2 className="auth-card__title">{title}</h2>
        {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
        {children}
        {footer && <div className="auth-card__footer">{footer}</div>}
      </Card>
    </div>
  );
}
