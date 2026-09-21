const DAY_MS = 86_400_000;

export type DateLanguage = 'en' | 'fr';

export function dateLocale(language: DateLanguage) {
  return language === 'fr' ? 'fr-FR' : 'en-GB';
}

export function formatDate(
  value: string | number | Date,
  language: DateLanguage,
  options: Intl.DateTimeFormatOptions,
) {
  const date = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);
  return date.toLocaleDateString(dateLocale(language), options);
}

export function formatTime(value: number | Date, language: DateLanguage) {
  return new Date(value).toLocaleTimeString(dateLocale(language), {
    hour: '2-digit', minute: '2-digit',
  });
}

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

export function formatPeriodLabel(
  fromDate: string,
  toDate: string,
  language: DateLanguage = 'en',
  compact = false,
) {
  if (!fromDate) return 'All dates';
  if (!toDate || fromDate === toDate) {
    return formatDate(fromDate, language, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
  if (compact) {
    const sameMonth = calendarMonthOf(fromDate) === calendarMonthOf(toDate);
    const start = formatDate(fromDate, language, {
      day: 'numeric',
      ...(sameMonth ? {} : { month: 'short' }),
    });
    return `${start}–${formatDate(toDate, language, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })}`;
  }
  return `${formatDate(fromDate, language, {
    day: '2-digit',
    month: 'short',
  })} – ${formatDate(toDate, language, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })}`;
}

export function formatCompactPeriodLabel(
  fromDate: string,
  toDate: string,
  language: DateLanguage = 'en',
) {
  return formatPeriodLabel(fromDate, toDate, language, true);
}

export function reportChartMonth(fromDate: string, toDate: string, today = localBusinessDate()) {
  if (!fromDate || !toDate || (fromDate <= today && today <= toDate)) {
    return calendarMonthOf(today);
  }
  const totals = new Map<string, number>();
  for (let day = fromDate; day <= toDate; day = shiftBusinessDate(day, 1)) {
    const month = calendarMonthOf(day);
    totals.set(month, (totals.get(month) ?? 0) + 1);
  }
  return [...totals].reduce(
    (selected, [month, days]) =>
      days >= (totals.get(selected) ?? 0) ? month : selected,
    calendarMonthOf(fromDate),
  );
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
