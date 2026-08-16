import React from "react";

/* ==========================================================
   Charts.jsx
   Shaxanno (charts) SVG saafi ah — library dibadda ah looma
   baahna (recharts/chart.js). Wax install ah ma jiro.
   ========================================================== */

const PALETTE = [
  "#4361ee",
  "#4cc9f0",
  "#f72585",
  "#7209b7",
  "#f9a826",
  "#2ec4b6",
  "#ff6b6b",
  "#3a0ca3",
];

/** Qiimaha ugu sarreeya u rog nambar nadiif ah (10, 50, 100...) */
function niceMax(value) {
  if (!value || value <= 0) return 10;
  const exp = Math.floor(Math.log10(value));
  const base = Math.pow(10, exp);
  return Math.ceil(value / base) * base;
}

/** Nambarada waaweyn u soo gaabi: 1200 -> 1.2k */
function shortNum(n) {
  if (Math.abs(n) >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

export function ChartEmpty({ text = "Xog lama helin weli" }) {
  return (
    <div className="chart-empty">
      <span>{text}</span>
    </div>
  );
}

/* ---------------------------------------------------------
   AREA / LINE CHART — isbeddelka dakhliga bilaha
   --------------------------------------------------------- */
export function AreaChart({
  data = [],
  color = "#4361ee",
  prefix = "",
  height = 280,
}) {
  const clean = data.filter((d) => d && typeof d.value === "number");
  const hasData = clean.some((d) => d.value > 0);
  if (!clean.length || !hasData) return <ChartEmpty />;

  const W = 720;
  const H = 300;
  const padL = 52;
  const padR = 18;
  const padT = 18;
  const padB = 38;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const max = niceMax(Math.max(...clean.map((d) => d.value)));
  const n = clean.length;
  const stepX = n > 1 ? plotW / (n - 1) : 0;

  const xOf = (i) => padL + (n > 1 ? i * stepX : plotW / 2);
  const yOf = (v) => padT + plotH - (v / max) * plotH;

  const linePath = clean
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xOf(i)} ${yOf(d.value)}`)
    .join(" ");

  const areaPath =
    `${linePath} L ${xOf(n - 1)} ${padT + plotH} L ${xOf(0)} ${padT + plotH} Z`;

  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const gradId = "areaGrad-" + color.replace("#", "");

  return (
    <svg
      className="chart-svg"
      viewBox={`0 0 ${W} ${H}`}
      style={{ height }}
      preserveAspectRatio="xMidYMid meet"
      role="img"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Xariiqyada gadaal (grid) */}
      {ticks.map((t, i) => {
        const y = padT + plotH - t * plotH;
        return (
          <g key={i}>
            <line
              x1={padL}
              y1={y}
              x2={W - padR}
              y2={y}
              stroke="#e9ecef"
              strokeWidth="1"
            />
            <text
              x={padL - 10}
              y={y + 4}
              textAnchor="end"
              className="chart-axis-text"
            >
              {prefix + shortNum(Math.round(max * t))}
            </text>
          </g>
        );
      })}

      {/* Area + line */}
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Dhibcaha */}
      {clean.map((d, i) => (
        <g key={i}>
          <circle
            cx={xOf(i)}
            cy={yOf(d.value)}
            r="4"
            fill="#fff"
            stroke={color}
            strokeWidth="2.5"
          />
          <title>{`${d.label}: ${prefix}${d.value}`}</title>
        </g>
      ))}

      {/* Labels-ka hoose */}
      {clean.map((d, i) => (
        <text
          key={"lbl" + i}
          x={xOf(i)}
          y={H - 14}
          textAnchor="middle"
          className="chart-axis-text"
        >
          {d.label}
        </text>
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------
   BAR CHART — tirooyin la barbar dhigayo
   --------------------------------------------------------- */
export function BarChart({
  data = [],
  color = "#4361ee",
  prefix = "",
  height = 280,
}) {
  const clean = data.filter((d) => d && typeof d.value === "number");
  const hasData = clean.some((d) => d.value > 0);
  if (!clean.length || !hasData) return <ChartEmpty />;

  const W = 720;
  const H = 300;
  const padL = 52;
  const padR = 18;
  const padT = 18;
  const padB = 46;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const max = niceMax(Math.max(...clean.map((d) => d.value)));
  const n = clean.length;
  const slot = plotW / n;
  const barW = Math.min(52, slot * 0.55);
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg
      className="chart-svg"
      viewBox={`0 0 ${W} ${H}`}
      style={{ height }}
      preserveAspectRatio="xMidYMid meet"
      role="img"
    >
      {ticks.map((t, i) => {
        const y = padT + plotH - t * plotH;
        return (
          <g key={i}>
            <line
              x1={padL}
              y1={y}
              x2={W - padR}
              y2={y}
              stroke="#e9ecef"
              strokeWidth="1"
            />
            <text
              x={padL - 10}
              y={y + 4}
              textAnchor="end"
              className="chart-axis-text"
            >
              {prefix + shortNum(Math.round(max * t))}
            </text>
          </g>
        );
      })}

      {clean.map((d, i) => {
        const barH = (d.value / max) * plotH;
        const x = padL + i * slot + (slot - barW) / 2;
        const y = padT + plotH - barH;
        const fill = d.color || color;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={Math.max(barH, 2)}
              rx="6"
              fill={fill}
            >
              <title>{`${d.label}: ${prefix}${d.value}`}</title>
            </rect>
            <text
              x={x + barW / 2}
              y={y - 7}
              textAnchor="middle"
              className="chart-value-text"
            >
              {prefix + shortNum(d.value)}
            </text>
            <text
              x={x + barW / 2}
              y={H - 16}
              textAnchor="middle"
              className="chart-axis-text"
            >
              {String(d.label).length > 12
                ? String(d.label).slice(0, 11) + "…"
                : d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------------------------------------------------------
   DONUT CHART — qaybinta (categories, status...)
   --------------------------------------------------------- */
export function DonutChart({ data = [], height = 280, centerLabel = "Total" }) {
  const clean = data.filter((d) => d && d.value > 0);
  if (!clean.length) return <ChartEmpty />;

  const total = clean.reduce((s, d) => s + d.value, 0);
  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const r = 88;
  const C = 2 * Math.PI * r;

  let acc = 0;

  return (
    <div className="donut-wrap">
      <svg
        className="chart-svg"
        viewBox={`0 0 ${size} ${size}`}
        style={{ height: height - 70, maxWidth: 240 }}
        role="img"
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#eef1f6"
          strokeWidth="26"
        />
        {clean.map((d, i) => {
          const frac = d.value / total;
          const dash = frac * C;
          const el = (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={d.color || PALETTE[i % PALETTE.length]}
              strokeWidth="26"
              strokeDasharray={`${dash} ${C - dash}`}
              strokeDashoffset={-acc * C}
              transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="butt"
            >
              <title>{`${d.label}: ${d.value} (${Math.round(frac * 100)}%)`}</title>
            </circle>
          );
          acc += frac;
          return el;
        })}

        <text x={cx} y={cy - 4} textAnchor="middle" className="donut-total">
          {total}
        </text>
        <text x={cx} y={cy + 18} textAnchor="middle" className="chart-axis-text">
          {centerLabel}
        </text>
      </svg>

      <ul className="chart-legend">
        {clean.map((d, i) => (
          <li key={i}>
            <span
              className="legend-dot"
              style={{ background: d.color || PALETTE[i % PALETTE.length] }}
            />
            <span className="legend-label">{d.label}</span>
            <span className="legend-value">
              {d.value} ({Math.round((d.value / total) * 100)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { PALETTE };