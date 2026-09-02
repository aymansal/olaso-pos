import { useMemo, useState } from 'react';
import type { useCostManagement } from '../../../../data/useCostManagement.ts';
import { formatMoney } from '../../../../lib/money.ts';
import { useT } from '../../../../lib/locale';
import { CompensationDialog } from '../CompensationDialog/CompensationDialog.tsx';
import { ExpenseDialog } from '../ExpenseDialog/ExpenseDialog.tsx';
import styles from './CostsPanel.module.css';

type CostManagement = ReturnType<typeof useCostManagement>;

export function CostsPanel({
  management,
  showCompensation,
}: {
  management: CostManagement;
  showCompensation: boolean;
}) {
  const t = useT();
  const [expenseEditor, setExpenseEditor] = useState<
    'new' | NonNullable<CostManagement['saved']>['expenses'][number]
  >();
  const [compensationOpen, setCompensationOpen] = useState(false);
  const saved = management.saved;
  const correctedIds = useMemo(
    () => new Set(saved?.expenses.flatMap((expense) =>
      expense.correctionOfExpenseId ? [expense.correctionOfExpenseId] : []) ?? []),
    [saved?.expenses],
  );
  if (management.isLoading) {
    return <div className={styles.state}>{t('Loading saved costs…')}</div>;
  }
  if (management.error || !saved) {
    return (
      <div className={styles.state} role="alert">
        {t(management.error ?? 'Saved costs are unavailable.')}
      </div>
    );
  }
  return (
    <section className={styles.costs} aria-label={t('Add costs')}>
      <header className={styles.toolbar}>
        <span>
          <button className={styles.ghost} type="button" onClick={() => setExpenseEditor('new')}>
            {t('Add expense')}
          </button>
          {showCompensation ? (
            <button
              className={styles.solid}
              type="button"
              disabled={!saved.staff.length}
              onClick={() => setCompensationOpen(true)}
            >
              {t('Add monthly pay')}
            </button>
          ) : null}
        </span>
      </header>
      <div className={`${styles.lists} ${showCompensation ? '' : styles.single}`}>
        <section>
          <h3>{t('Expenses')}</h3>
          <div className={styles.rows}>
            {saved.expenses.length ? saved.expenses.slice(0, 8).map((expense) => (
              <article key={expense.id}>
                <span>
                  <strong>{expense.description}</strong>
                  <small>
                    {expense.category}
                    {' · '}
                    {expense.transactionType === 'reversal'
                      ? t('Reversal')
                      : expense.recurrence === 'monthly'
                        ? t('Split by days')
                        : expense.effectiveDate}
                  </small>
                </span>
                <b>
                  {expense.transactionType === 'reversal' ? '−' : ''}
                  {formatMoney(expense.amountCentimes)}
                </b>
                {expense.transactionType === 'recorded' && !correctedIds.has(expense.id) ? (
                  <button type="button" onClick={() => setExpenseEditor(expense)}>
                    {t('Correct')}
                  </button>
                ) : null}
              </article>
            )) : <p>{t('No expenses saved.')}</p>}
          </div>
        </section>
        {showCompensation ? (
          <section>
            <h3>{t('Monthly pay')}</h3>
            <div className={styles.rows}>
              {saved.compensation.length ? saved.compensation.slice(0, 8).map((period) => (
                <article key={period.id}>
                  <span>
                    <strong>
                      {saved.staff.find((profile) => profile.id === period.staffProfileId)?.name
                        ?? period.staffNameSnapshot
                        ?? t('Staff')}
                    </strong>
                    <small>
                      {period.effectiveStartDate ?? period.effectiveStartMonth}
                      {period.effectiveEndDate || period.effectiveEndMonth
                        ? ` – ${period.effectiveEndDate ?? period.effectiveEndMonth}`
                        : ` ${t('onward')}`}
                    </small>
                  </span>
                  <b>{formatMoney(period.monthlyAmountCentimes)}</b>
                  <button
                    type="button"
                    onClick={() => {
                      if (!window.confirm(t('Stop this monthly pay from today?'))) return;
                      void management.deleteCompensation(period);
                    }}
                  >
                    {t('Stop')}
                  </button>
                </article>
              )) : <p>{t('No monthly pay saved.')}</p>}
            </div>
          </section>
        ) : null}
      </div>
      {expenseEditor ? (
        <ExpenseDialog
          expense={expenseEditor === 'new' ? undefined : expenseEditor}
          onClose={() => setExpenseEditor(undefined)}
          onSave={(input) => expenseEditor === 'new'
            ? management.addExpense(input).then(() => undefined)
            : management.correctExpense(expenseEditor, input).then(() => undefined)}
        />
      ) : null}
      {compensationOpen ? (
        <CompensationDialog
          staff={saved.staff}
          onClose={() => setCompensationOpen(false)}
          onSave={(input) => management.addCompensation(input).then(() => undefined)}
        />
      ) : null}
    </section>
  );
}
