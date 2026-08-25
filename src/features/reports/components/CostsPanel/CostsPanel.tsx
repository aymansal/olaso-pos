import { useMemo, useState } from 'react';
import type { useCostManagement } from '../../../../data/useCostManagement.ts';
import { formatMoney } from '../../../../lib/money.ts';
import { CompensationDialog } from '../CompensationDialog/CompensationDialog.tsx';
import { ExpenseDialog } from '../ExpenseDialog/ExpenseDialog.tsx';
import styles from './CostsPanel.module.css';

type CostManagement = ReturnType<typeof useCostManagement>;

export function CostsPanel({
  month,
  onMonthChange,
  management,
}: {
  month: string;
  onMonthChange: (month: string) => void;
  management: CostManagement;
}) {
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
    return <div className={styles.state}>Loading saved costs…</div>;
  }
  if (management.error || !saved) {
    return <div className={styles.state} role="alert">{management.error ?? 'Saved costs are unavailable.'}</div>;
  }
  const profit = saved.profitability;
  const cards = profit
    ? [
        ['Revenue', profit.revenueCentimes],
        ['Ingredient cost', profit.ingredientCostCentimes],
        ['Operating expenses', saved.otherExpenseCentimes + profit.compensationCentimes],
        ['Operating profit', profit.operatingProfitCentimes],
      ] as const
    : [
        ['Purchase cash', saved.purchaseCashCentimes],
        ['Operating expenses', saved.otherExpenseCentimes],
      ] as const;
  return (
    <section className={styles.costs} aria-label="Costs and profitability">
      <header className={styles.toolbar}>
        <label>Month<input type="month" value={month} onChange={(event) => onMonthChange(event.target.value)} /></label>
        <span>
          <button type="button" onClick={() => setExpenseEditor('new')}>Add expense</button>
          {profit ? <button type="button" disabled={!saved.staff.length} onClick={() => setCompensationOpen(true)}>Add compensation</button> : null}
        </span>
      </header>
      <div className={styles.kpis}>
        {cards.map(([label, value]) => <article key={label}><small>{label}</small><strong>{formatMoney(value)}</strong></article>)}
      </div>
      {profit && !profit.complete ? <p className={styles.incomplete}>Profit is incomplete because {profit.incompleteSaleCount} saved sale{profit.incompleteSaleCount === 1 ? '' : 's'} lack complete ingredient cost.</p> : null}
      <div className={`${styles.lists} ${profit ? '' : styles.single}`}>
        <section>
          <h3>Expenses</h3>
          <div className={styles.rows}>
            {saved.expenses.length ? saved.expenses.slice(0, 7).map((expense) => (
              <article key={expense.id}>
                <span><strong>{expense.description}</strong><small>{expense.category} · {expense.transactionType === 'reversal' ? 'Reversal' : expense.recurrence === 'monthly' ? 'Monthly' : expense.effectiveDate}</small></span>
                <b>{expense.transactionType === 'reversal' ? '−' : ''}{formatMoney(expense.amountCentimes)}</b>
                {expense.transactionType === 'recorded' && !correctedIds.has(expense.id) ? <button type="button" onClick={() => setExpenseEditor(expense)}>Correct</button> : null}
              </article>
            )) : <p>No expenses saved.</p>}
          </div>
        </section>
        {profit ? (
          <section>
            <h3>Compensation</h3>
            <div className={styles.rows}>
              {saved.compensation.length ? saved.compensation.slice(0, 7).map((period) => (
                <article key={period.id}>
                  <span><strong>{saved.staff.find((profile) => profile.id === period.staffProfileId)?.name ?? period.staffNameSnapshot ?? 'Staff'}</strong><small>{period.effectiveStartMonth}{period.effectiveEndMonth ? ` – ${period.effectiveEndMonth}` : ' onward'}</small></span>
                  <b>{formatMoney(period.monthlyAmountCentimes)}</b>
                </article>
              )) : <p>No compensation saved.</p>}
            </div>
          </section>
        ) : null}
      </div>
      {expenseEditor ? <ExpenseDialog expense={expenseEditor === 'new' ? undefined : expenseEditor} onClose={() => setExpenseEditor(undefined)} onSave={(input) => expenseEditor === 'new' ? management.addExpense(input).then(() => undefined) : management.correctExpense(expenseEditor, input).then(() => undefined)} /> : null}
      {compensationOpen ? <CompensationDialog staff={saved.staff} onClose={() => setCompensationOpen(false)} onSave={(input) => management.addCompensation(input).then(() => undefined)} /> : null}
    </section>
  );
}
