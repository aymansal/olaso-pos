import { ChevronLeft, ChevronRight } from '@boxicons/react';
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { OverlayPortal } from '../OverlayPortal';
import {
  calendarMonthEnd,
  calendarMonthOf,
  calendarMonthStart,
  localBusinessDate,
  rangeFromAnchor,
  shiftBusinessDate,
  shiftCalendarMonth,
  startOfIsoWeek,
} from '../../lib/date';
import { useLanguage, useT } from '../../lib/locale';
import styles from './PeriodCalendar.module.css';

export type PeriodRange = { fromDate: string; toDate: string };
export type PeriodPreset =
  | 'today'
  | 'yesterday'
  | 'thisWeek'
  | 'lastWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'all';

const PRESET_LABELS: Record<PeriodPreset, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  thisWeek: 'This week',
  lastWeek: 'Last week',
  thisMonth: 'This month',
  lastMonth: 'Last month',
  all: 'All',
};

const WEEKDAYS_EN = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const WEEKDAYS_FR = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function monthCells(month: string) {
  const start = calendarMonthStart(month);
  const weekday = new Date(`${start}T12:00:00`).getDay();
  const mondayIndex = weekday === 0 ? 6 : weekday - 1;
  const first = shiftBusinessDate(start, -mondayIndex);
  return Array.from({ length: 42 }, (_, index) => shiftBusinessDate(first, index));
}

export function presetRange(preset: PeriodPreset, today = localBusinessDate()): PeriodRange {
  if (preset === 'today') return { fromDate: today, toDate: today };
  if (preset === 'yesterday') {
    const day = shiftBusinessDate(today, -1);
    return { fromDate: day, toDate: day };
  }
  if (preset === 'thisWeek') {
    return { fromDate: startOfIsoWeek(today), toDate: today };
  }
  if (preset === 'lastWeek') {
    const start = startOfIsoWeek(today);
    return {
      fromDate: shiftBusinessDate(start, -7),
      toDate: shiftBusinessDate(start, -1),
    };
  }
  if (preset === 'thisMonth') {
    return { fromDate: calendarMonthStart(calendarMonthOf(today)), toDate: today };
  }
  if (preset === 'lastMonth') {
    const month = shiftCalendarMonth(calendarMonthOf(today), -1);
    return { fromDate: calendarMonthStart(month), toDate: calendarMonthEnd(month) };
  }
  return { fromDate: shiftBusinessDate(today, -30), toDate: today };
}

function place(anchor: DOMRect, width: number, height: number): CSSProperties {
  const viewW = window.innerWidth;
  const viewH = window.innerHeight;
  const gap = 6;
  const openUp = viewH - anchor.bottom < height + gap
    && anchor.top >= height + gap;
  let top = openUp ? anchor.top - height - gap : anchor.bottom + gap;
  let left = anchor.left;
  if (left + width > viewW - 8) left = anchor.right - width;
  left = Math.max(8, Math.min(left, viewW - width - 8));
  top = Math.max(8, Math.min(top, viewH - height - 8));
  return { top, left };
}

export function PeriodCalendar({
  mode,
  fromDate,
  toDate,
  presets = [],
  maxDays = 31,
  allowEmpty = false,
  activePreset,
  anchor,
  onChange,
  onClose,
}: {
  mode: 'range' | 'day';
  fromDate: string;
  toDate: string;
  presets?: PeriodPreset[];
  maxDays?: number;
  allowEmpty?: boolean;
  activePreset?: PeriodPreset;
  anchor: DOMRect;
  onChange: (range: PeriodRange, preset?: PeriodPreset) => void;
  onClose: () => void;
}) {
  const t = useT();
  const language = useLanguage();
  const today = localBusinessDate();
  const compact = presets.length === 0;
  const dialog = useRef<HTMLElement>(null);
  const [style, setStyle] = useState<CSSProperties>(() =>
    place(anchor, compact ? 248 : 400, 248),
  );
  const [visibleMonth, setVisibleMonth] = useState(
    calendarMonthOf(fromDate || today),
  );
  const [pick, setPick] = useState(fromDate && fromDate === toDate ? fromDate : '');
  const [draft, setDraft] = useState<PeriodRange>({
    fromDate: fromDate || today,
    toDate: toDate || today,
  });
  const title = new Date(`${visibleMonth}-01T12:00:00`).toLocaleDateString(
    language === 'fr' ? 'fr-FR' : 'en-GB',
    { month: 'long', year: 'numeric' },
  );

  useLayoutEffect(() => {
    if (!dialog.current) return;
    setStyle(place(anchor, dialog.current.offsetWidth, dialog.current.offsetHeight));
  }, [anchor, visibleMonth, draft, pick]);

  function apply(range: PeriodRange, preset?: PeriodPreset) {
    onChange(range, preset);
    onClose();
  }

  function pickDay(day: string) {
    if (mode === 'day') {
      apply({ fromDate: day, toDate: day });
      return;
    }
    if (!pick) {
      setPick(day);
      setDraft({ fromDate: day, toDate: day });
      return;
    }
    if (day === pick) {
      apply({ fromDate: day, toDate: day });
      return;
    }
    apply(rangeFromAnchor(pick, day, maxDays));
  }

  return (
    <OverlayPortal>
      <div
        className={styles.overlay}
        role="presentation"
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          onClose();
        }}
      >
        <section
          ref={dialog}
          className={compact ? `${styles.dialog} ${styles.compact}` : styles.dialog}
          role="dialog"
          aria-modal="true"
          aria-label={t('Calendar')}
          style={style}
        >
          {presets.length ? (
          <nav className={styles.presets} aria-label={t('Quick period')}>
            {presets.map((preset) => (
              <button
                type="button"
                className={activePreset === preset ? styles.presetOn : styles.preset}
                key={preset}
                onClick={() => {
                  if (preset === 'all' && allowEmpty) {
                    onChange({ fromDate: '', toDate: '' }, preset);
                    onClose();
                    return;
                  }
                  apply(presetRange(preset, today), preset);
                }}
              >
                {t(PRESET_LABELS[preset])}
              </button>
            ))}
          </nav>
          ) : null}
          <div className={styles.month}>
            <header className={styles.monthHeader}>
              <button
                type="button"
                aria-label={t('Previous month')}
                onClick={() => setVisibleMonth(shiftCalendarMonth(visibleMonth, -1))}
              >
                <ChevronLeft width={14} height={14} />
              </button>
              <strong>{title}</strong>
              <button
                type="button"
                aria-label={t('Next month')}
                onClick={() => setVisibleMonth(shiftCalendarMonth(visibleMonth, 1))}
              >
                <ChevronRight width={14} height={14} />
              </button>
            </header>
            <div className={styles.weekdays} aria-hidden="true">
              {(language === 'fr' ? WEEKDAYS_FR : WEEKDAYS_EN).map((label, index) => (
                <span key={`${label}-${index}`}>{label}</span>
              ))}
            </div>
            <div className={styles.grid}>
              {monthCells(visibleMonth).map((day) => {
                const inMonth = calendarMonthOf(day) === visibleMonth;
                const start = draft.fromDate;
                const end = draft.toDate;
                const inRange = start && end && day >= start && day <= end;
                const selected = day === start || day === end || day === pick;
                return (
                  <button
                    type="button"
                    key={day}
                    className={[
                      styles.day,
                      inMonth ? '' : styles.outside,
                      inRange ? styles.inRange : '',
                      selected ? styles.selected : '',
                      day === today ? styles.today : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => pickDay(day)}
                  >
                    {Number(day.slice(8))}
                  </button>
                );
              })}
            </div>
            {mode === 'range' && draft.fromDate && draft.fromDate === draft.toDate && pick ? (
              <p className={styles.hint}>{t('Tap another day for a period.')}</p>
            ) : null}
          </div>
        </section>
      </div>
    </OverlayPortal>
  );
}
