const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(value) {
  return currencyFormatter.format(value);
}

const numberFormatter = new Intl.NumberFormat("en-US");

export function formatNumber(value) {
  return numberFormatter.format(value);
}

export function formatPercent(value) {
  return `${value.toFixed(1)}%`;
}

export function formatDate(value, options = { dateStyle: "medium" }) {
  return new Intl.DateTimeFormat("en-US", options).format(new Date(value));
}

/** Uppercases the first letter of a label (e.g. "editor" → "Editor"). */
export function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}
