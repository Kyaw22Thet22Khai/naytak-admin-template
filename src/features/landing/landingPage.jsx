import { Link } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  IconArrowRight,
  IconCheck,
  IconRocket,
  IconSparkles,
  LineChart,
  PieChart,
  Stack,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { APP_NAME, APP_VERSION } from "../../constants/app";
import { ROUTES } from "../../app/routes";
import { TEMPLATE_STATS, MODULES, TECH_STACK } from "./data/stats";
import { REVENUE_SERIES, CATEGORY_SALES } from "../dashboard/data/mock";
import logo from "../../assets/logo.svg";
import "./landing.css";

/**
 * Public landing page shown before the admin shell.
 * Gives a first impression of the template: headline stats, the full
 * module map and a live chart preview — then routes into the Dashboard.
 */
export function LandingPage() {
  useDocumentTitle("Welcome");

  // Revenue & Expenses preview (from the dashboard mock data).
  const revenueData = REVENUE_SERIES[0].data.map((point) => ({
    ...point,
    y: Math.round(point.y / 1000),
  }));
  const expensesData = REVENUE_SERIES[1].data.map((point) => ({
    ...point,
    y: Math.round(point.y / 1000),
  }));

  return (
    <div className="landing">
      {/* Top navigation */}
      <header className="landing-nav">
        <a className="landing-nav__brand" href="#top">
          <span className="landing-nav__logo">
            <img src={logo} alt={`${APP_NAME} logo`} />
          </span>
          <span className="landing-nav__name">{APP_NAME}</span>
          <Badge size="sm" color="primary" variant="soft">
            v{APP_VERSION}
          </Badge>
        </a>
        <nav className="landing-nav__links" aria-label="Landing">
          <a href="#stats">Stats</a>
          <a href="#modules">Modules</a>
          <a href="#charts">Charts</a>
          <a href="#stack">Stack</a>
        </nav>
        <Stack direction="row" spacing={10}>
          <Button
            variant="ghost"
            size="sm"
            as={Link}
            to={ROUTES.login}
            className="landing-nav__login">
            Sign in
          </Button>
          <Button
            size="sm"
            as={Link}
            to={ROUTES.dashboard}
            rightIcon={<IconArrowRight size={16} />}>
            Enter Dashboard
          </Button>
        </Stack>
      </header>

      {/* Hero */}
      <section className="landing-hero" id="top">
        <div className="landing-hero__inner">
          <div className="landing-hero__copy">
            <Badge
              color="primary"
              variant="soft"
              leftIcon={<IconSparkles size={14} />}
              className="landing-hero__badge">
              React 19 · Vite 7 · naytak-react-ui
            </Badge>
            <h1 className="landing-hero__title">
              The <span className="landing-hero__gradient">complete</span> admin
              template
            </h1>
            <p className="landing-hero__subtitle">
              {APP_NAME} ships 14 ready-made modules, 153 sample records and a
              640-icon UI kit — fully themeable, tested and ready to deploy. No
              setup guesses, just one click into the dashboard.
            </p>
            <Stack
              direction="row"
              spacing={12}
              wrap
              className="landing-hero__actions">
              <Button
                size="lg"
                as={Link}
                to={ROUTES.dashboard}
                rightIcon={<IconArrowRight size={18} />}>
                Explore the Dashboard
              </Button>
              <Button size="lg" variant="ghost" as="a" href="#modules">
                See what&apos;s inside
              </Button>
            </Stack>
          </div>

          {/* Hero visual — live chart preview from template data */}
          <div className="landing-hero__visual">
            <Card className="landing-preview" variant="elevated">
              <div className="landing-preview__head">
                <span className="landing-preview__title">Revenue overview</span>
                <Badge color="success" variant="soft">
                  Live mock data
                </Badge>
              </div>
              <LineChart
                data={revenueData}
                height={220}
                fill
                curve
                showPoints={false}
                ariaLabel="Revenue preview chart"
              />
              <div className="landing-preview__legend">
                <span className="landing-preview__dot landing-preview__dot--revenue" />
                Revenue
                <span className="landing-preview__dot landing-preview__dot--expenses" />
                Expenses
              </div>
            </Card>

            <Card className="landing-floating landing-floating--pie">
              <PieChart
                data={CATEGORY_SALES.map((item) => ({
                  label: item.label,
                  value: item.value,
                  color: item.color,
                }))}
                size={120}
                innerRadius={0.55}
                showLabels={false}
                showLegend={false}
                ariaLabel="Sales by category"
              />
            </Card>

            <Card className="landing-floating landing-floating--chip">
              <IconRocket size={18} className="landing-floating__icon" />
              <div>
                <strong>14 modules</strong>
                <span>ready to ship</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="landing-section" id="stats">
        <h2 className="landing-section__title">The template, by the numbers</h2>
        <p className="landing-section__subtitle">
          Figures pulled straight from this codebase and the naytak-react-ui
          package.
        </p>
        <div className="landing-stats">
          {TEMPLATE_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.id} className="landing-stat" variant="outlined">
                <span
                  className={`landing-stat__icon landing-stat__icon--${stat.color}`}>
                  <Icon size={22} />
                </span>
                <div className="landing-stat__value">{stat.value}</div>
                <div className="landing-stat__label">{stat.label}</div>
                <div className="landing-stat__note">{stat.note}</div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Modules map */}
      <section className="landing-section landing-section--alt" id="modules">
        <h2 className="landing-section__title">Everything already built</h2>
        <p className="landing-section__subtitle">
          Fourteen complete modules — open any of them straight from here.
        </p>
        <div className="landing-modules">
          {MODULES.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                to={module.path}
                key={module.key}
                className="landing-module">
                <span className="landing-module__icon">
                  <Icon size={20} />
                </span>
                <div className="landing-module__body">
                  <div className="landing-module__label">{module.label}</div>
                  <div className="landing-module__desc">
                    {module.description}
                  </div>
                </div>
                <IconArrowRight size={16} className="landing-module__arrow" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Chart showcase */}
      <section className="landing-section" id="charts">
        <h2 className="landing-section__title">
          Data visualisation, out of the box
        </h2>
        <p className="landing-section__subtitle">
          Ten chart components — no extra dependencies, fully themed.
        </p>
        <div className="landing-charts">
          <Card className="landing-chart-card" variant="elevated">
            <div className="landing-chart-card__title">
              Revenue vs Expenses{" "}
              <Badge size="sm" color="info" variant="soft">
                area · bar · line
              </Badge>
            </div>
            <LineChart
              data={revenueData}
              height={240}
              fill
              curve
              ariaLabel="Revenue vs expenses chart"
            />
          </Card>
          <Card className="landing-chart-card" variant="elevated">
            <div className="landing-chart-card__title">
              Sales by category{" "}
              <Badge size="sm" color="warning" variant="soft">
                pie · donut
              </Badge>
            </div>
            <PieChart
              data={CATEGORY_SALES.map((item) => ({
                label: item.label,
                value: item.value,
                color: item.color,
              }))}
              size={240}
              innerRadius={0.45}
              showLabels
              showLegend
              ariaLabel="Sales by category chart"
            />
          </Card>
        </div>
      </section>

      {/* Tech stack */}
      <section className="landing-section landing-section--alt" id="stack">
        <h2 className="landing-section__title">
          A modern, boring-reliable stack
        </h2>
        <p className="landing-section__subtitle">
          Only six moving parts — each one a category leader.
        </p>
        <div className="landing-stack">
          {TECH_STACK.map((tech) => (
            <Card key={tech.name} className="landing-tech" variant="outlined">
              <div className="landing-tech__check">
                <IconCheck size={16} />
              </div>
              <div className="landing-tech__name">{tech.name}</div>
              <div className="landing-tech__role">{tech.role}</div>
              <div className="landing-tech__note">{tech.note}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2 className="landing-cta__title">Ready to take a look around?</h2>
        <p className="landing-cta__subtitle">
          Jump straight into the dashboard and play with the live mock data.
        </p>
        <Button
          size="lg"
          as={Link}
          to={ROUTES.dashboard}
          rightIcon={<IconArrowRight size={18} />}>
          Open the Dashboard
        </Button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <span className="landing-footer__brand">
          <img
            src={logo}
            alt={`${APP_NAME} logo`}
            className="landing-footer__logo"
          />
          {APP_NAME}
        </span>
        <span className="landing-footer__meta">
          © {new Date().getFullYear()} · v{APP_VERSION} · Built with
          naytak-react-ui
        </span>
      </footer>
    </div>
  );
}
