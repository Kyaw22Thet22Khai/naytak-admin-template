import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import {
  ThemeProvider,
  FunnelChart,
  GaugeChart,
  GroupedBarChart,
  LineChart,
  PieChart,
} from "naytak-react-ui";
import { REVENUE_SERIES, CATEGORY_SALES } from "./dashboard/data/mock";
import {
  VISITOR_SERIES,
  CONVERSION,
  REGION_SALES,
  LEAD_FUNNEL,
} from "./analytics/data/mock";
import {
  CHART_ASPECT,
  CHART_HEIGHT,
  FUNNEL_CHART_HEIGHT,
  SQUARE_CHART_MAX,
} from "../constants/charts";

/**
 * Every chart in the app, checked for geometry that escapes its own viewBox.
 *
 * This exists because naytak-react-ui's AreaChart drew the dashboard revenue
 * series as a running total over months rather than stacking across series.
 * By December the path reached ~88,000 against an axis topping out at 19,580,
 * so it flew 882 units above the top of a 300-unit box. Nothing threw — it
 * just rendered nonsense. Escaping geometry is the signal that catches it.
 */

/** Parameter count per SVG path command, and which of them is the endpoint. */
const COMMANDS = {
  M: { size: 2, point: [0, 1] },
  L: { size: 2, point: [0, 1] },
  T: { size: 2, point: [0, 1] },
  C: {
    size: 6,
    point: [4, 5],
    controls: [
      [0, 1],
      [2, 3],
    ],
  },
  S: { size: 4, point: [2, 3], controls: [[0, 1]] },
  Q: { size: 4, point: [2, 3], controls: [[0, 1]] },
  // Arc: rx ry rotation large-arc sweep x y — only the last pair is a point,
  // which is why splitting a path into naive x/y pairs misreads every donut.
  A: { size: 7, point: [5, 6] },
  H: { size: 1, point: [0, null] },
  V: { size: 1, point: [null, 0] },
  Z: { size: 0, point: null },
};

/** Endpoints and control points of a path, in user units. */
function pathPoints(d) {
  const points = [];
  const tokens =
    d.match(/[MmLlHhVvCcSsQqTtAaZz]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];
  let i = 0;
  let command = null;
  let cursor = { x: 0, y: 0 };

  while (i < tokens.length) {
    if (/[A-Za-z]/.test(tokens[i])) {
      command = tokens[i];
      i += 1;
    }
    if (!command) break;

    const upper = command.toUpperCase();
    const spec = COMMANDS[upper];
    if (!spec) break;
    if (spec.size === 0) {
      command = null;
      continue;
    }

    const args = tokens.slice(i, i + spec.size).map(Number);
    if (args.length < spec.size) break;
    i += spec.size;

    const relative = command !== upper;
    const resolve = (x, y) => ({
      x: relative && x !== null ? cursor.x + x : x,
      y: relative && y !== null ? cursor.y + y : y,
    });

    for (const [cx, cy] of spec.controls ?? []) {
      points.push(resolve(args[cx], args[cy]));
    }

    const [px, py] = spec.point;
    const end = resolve(
      px === null ? cursor.x : args[px],
      py === null ? cursor.y : args[py],
    );
    points.push(end);
    cursor = { x: end.x ?? cursor.x, y: end.y ?? cursor.y };
  }

  return points;
}

/** Bounds of everything drawn inside a chart's SVG. */
function geometryBounds(container) {
  const svg = container.querySelector("svg");
  expect(svg, "chart rendered no <svg>").toBeTruthy();

  const [, , vbWidth, vbHeight] = (svg.getAttribute("viewBox") ?? "")
    .split(/\s+/)
    .map(Number);

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  const track = (x, y) => {
    if (Number.isFinite(x)) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
    }
    if (Number.isFinite(y)) {
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  };

  for (const path of svg.querySelectorAll("path")) {
    for (const p of pathPoints(path.getAttribute("d") ?? "")) track(p.x, p.y);
  }
  for (const rect of svg.querySelectorAll("rect")) {
    const x = Number(rect.getAttribute("x"));
    const y = Number(rect.getAttribute("y"));
    track(x, y);
    track(
      x + Number(rect.getAttribute("width") ?? 0),
      y + Number(rect.getAttribute("height") ?? 0),
    );
  }
  for (const circle of svg.querySelectorAll("circle")) {
    track(Number(circle.getAttribute("cx")), Number(circle.getAttribute("cy")));
  }

  return { minX, maxX, minY, maxY, vbWidth, vbHeight };
}

/** Slack for stroke widths and Bézier control points that sit just outside. */
const SLACK = 8;

function expectInsideViewBox(ui, name) {
  const { container } = render(<ThemeProvider>{ui}</ThemeProvider>);
  const b = geometryBounds(container);

  expect(Number.isFinite(b.minY), `${name}: no geometry found to measure`).toBe(
    true,
  );
  expect(b.minY, `${name}: drawn above the top of its viewBox`).toBeGreaterThan(
    -SLACK,
  );
  expect(b.maxY, `${name}: drawn below its viewBox`).toBeLessThan(
    b.vbHeight + SLACK,
  );
  expect(b.minX, `${name}: drawn left of its viewBox`).toBeGreaterThan(-SLACK);
  expect(b.maxX, `${name}: drawn right of its viewBox`).toBeLessThan(
    b.vbWidth + SLACK,
  );
}

describe("dashboard charts stay inside their viewBox", () => {
  test("Sales Overview", () => {
    expectInsideViewBox(
      <GroupedBarChart series={REVENUE_SERIES} height={CHART_HEIGHT} />,
      "Sales Overview",
    );
  });

  test("Sales by Category", () => {
    expectInsideViewBox(
      <PieChart
        data={CATEGORY_SALES}
        size={SQUARE_CHART_MAX}
        innerRadius={0.6}
      />,
      "Sales by Category",
    );
  });
});

describe("analytics charts stay inside their viewBox", () => {
  test("Visitors", () => {
    expectInsideViewBox(
      <LineChart data={VISITOR_SERIES} height={CHART_HEIGHT} fill showPoints />,
      "Visitors",
    );
  });

  test("Conversion Rate", () => {
    expectInsideViewBox(
      <GaugeChart
        value={CONVERSION.value}
        max={CONVERSION.max}
        size={SQUARE_CHART_MAX}
      />,
      "Conversion Rate",
    );
  });

  test("Sales by Region", () => {
    expectInsideViewBox(
      <GroupedBarChart
        series={REGION_SALES}
        height={CHART_HEIGHT}
        showValues
      />,
      "Sales by Region",
    );
  });

  test("Lead Funnel", () => {
    expectInsideViewBox(
      <FunnelChart
        data={LEAD_FUNNEL}
        height={FUNNEL_CHART_HEIGHT}
        showValues
      />,
      "Lead Funnel",
    );
  });
});

/**
 * Two charts in equal-width cards only look level if their viewBoxes share an
 * aspect ratio — the components scale to 100% of their container, so rendered
 * height is `cardWidth × (viewBoxHeight / viewBoxWidth)`. The funnel's viewBox
 * is 400 units wide against everything else's 600, so the same `height` prop
 * made it render 50% taller.
 */
describe("charts in a row render at the same height", () => {
  const aspectOf = (ui) => {
    const { container } = render(<ThemeProvider>{ui}</ThemeProvider>);
    const [, , w, h] = (
      container.querySelector("svg").getAttribute("viewBox") ?? ""
    )
      .split(/\s+/)
      .map(Number);
    return h / w;
  };

  test("Sales by Region and Lead Funnel share an aspect ratio", () => {
    const bars = aspectOf(
      <GroupedBarChart
        series={REGION_SALES}
        height={CHART_HEIGHT}
        showValues
      />,
    );
    const funnel = aspectOf(
      <FunnelChart
        data={LEAD_FUNNEL}
        height={FUNNEL_CHART_HEIGHT}
        showValues
      />,
    );

    expect(funnel).toBeCloseTo(bars, 5);
    expect(bars).toBeCloseTo(CHART_ASPECT, 5);
  });

  test("Visitors matches them too", () => {
    expect(
      aspectOf(<LineChart data={VISITOR_SERIES} height={CHART_HEIGHT} />),
    ).toBeCloseTo(CHART_ASPECT, 5);
  });
});
