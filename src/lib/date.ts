const DAY_MS = 86_400_000;

export function localBusinessDate(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function shiftBusinessDate(value: string, days: number) {
  return new Date(
    Date.parse(`${value}T00:00:00.000Z`) + days * DAY_MS,
  ).toISOString().slice(0, 10);
}

export function calendarMonthOf(date: string) {
  return date.slice(0, 7);
}

export function calendarMonthStart(month: string) {
  return `${month}-01`;
}

export function calendarMonthEnd(month: string) {
  const [year, calendarMonth] = month.split('-').map(Number);
  const last = new Date(Date.UTC(year, calendarMonth, 0)).getUTCDate();
  return `${month}-${String(last).padStart(2, '0')}`;
}

export function shiftCalendarMonth(month: string, delta: number) {
  const [year, calendarMonth] = month.split('-').map(Number);
  const date = new Date(Date.UTC(year, calendarMonth - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function startOfIsoWeek(date: string) {
  const weekday = new Date(`${date}T12:00:00`).getDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  return shiftBusinessDate(date, offset);
}

export function formatPeriodLabel(fromDate: string, toDate: string) {
  if (!fromDate) return 'All dates';
  const from = new Date(`${fromDate}T12:00:00`);
  if (!toDate || fromDate === toDate) {
    return from.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
  const to = new Date(`${toDate}T12:00:00`);
  return `${from.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  })} – ${to.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })}`;
}

export function inclusiveDayCount(fromDate: string, toDate: string) {
  return Math.floor(
    (
      Date.parse(`${toDate}T00:00:00.000Z`)
      - Date.parse(`${fromDate}T00:00:00.000Z`)
    ) / DAY_MS,
  ) + 1;
}

export function rangeFromAnchor(anchor: string, other: string, maxDays: number) {
  const start = anchor <= other ? anchor : other;
  const end = anchor <= other ? other : anchor;
  if (inclusiveDayCount(start, end) <= maxDays) {
    return { fromDate: start, toDate: end };
  }
  if (other >= anchor) {
    return { fromDate: anchor, toDate: shiftBusinessDate(anchor, maxDays - 1) };
  }
  return { fromDate: shiftBusinessDate(anchor, 1 - maxDays), toDate: anchor };
}
