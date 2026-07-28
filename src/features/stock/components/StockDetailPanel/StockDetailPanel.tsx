import { ArrowDown, Package, SlidersHorizontal, Warning } from '@phosphor-icons/react';
import { linkedRecipes, stockMovements } from '../../data/stockData';
import { StockIcon } from '../StockIcon/StockIcon';
import styles from './StockDetailPanel.module.css';

const stockLevels = [
  { label: 'ON HAND', value: '2.1 kg', tone: 'low' },
  { label: 'MINIMUM', value: '3.0 kg', tone: 'default' },
  { label: 'RECEIVE NEXT', value: '4.0 kg', tone: 'green' },
] as const;

export function StockDetailPanel() {
  return (
    <aside className={styles.panel} aria-labelledby="stock-item-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <h2 id="stock-item-title">Stock item</h2>
          <small>Ingredient details and movements</small>
        </span>
        <strong className={styles.lowStatus}><span aria-hidden="true" />Low stock</strong>
      </header>

      <section className={styles.identity} aria-label="Selected ingredient">
        <span className={styles.identityLeft}>
          <span className={styles.artwork}><Package size={20} aria-hidden="true" /></span>
          <span className={styles.identityCopy}>
            <strong>Pistachio cream</strong>
            <small>ING-PST-004 · Food prep</small>
          </span>
        </span>
        <span className={styles.unit}>
          <small>TRACKED IN</small>
          <strong>Kilograms</strong>
        </span>
      </section>

      <span className={`${styles.divider} ${styles.identityDivider}`} aria-hidden="true" />

      <section className={styles.levelSection} aria-labelledby="stock-level-title">
        <header className={styles.levelHeader}>
          <h3 id="stock-level-title">Stock level</h3>
          <small>Counted today at 08:12</small>
        </header>
        <div className={styles.levelStrip}>
          {stockLevels.map(({ label, value, tone }, index) => (
            <span className={styles.level} key={label}>
              {index > 0 ? <span className={styles.levelDivider} aria-hidden="true" /> : null}
              <small>{label}</small>
              <strong className={styles[tone]}>{value}</strong>
            </span>
          ))}
        </div>
        <div className={styles.warning}>
          <Warning size={14} aria-hidden="true" />
          <span>0.9 kg below minimum · approximately 18 servings left</span>
        </div>
      </section>

      <span className={`${styles.divider} ${styles.levelSectionDivider}`} aria-hidden="true" />

      <section className={styles.recipes} aria-labelledby="linked-recipes-title">
        <header className={styles.sectionHeader}>
          <h3 id="linked-recipes-title">Linked recipes</h3>
          <small>4 products</small>
        </header>
        <div className={styles.recipeList}>
          {linkedRecipes.map((recipe) => (
            <article className={styles.recipe} key={recipe.name}>
              <span className={styles.recipeIdentity}>
                <span className={styles.recipeIcon}><StockIcon name={recipe.icon} size={13} /></span>
                <strong>{recipe.name}</strong>
              </span>
              <small>{recipe.usage}</small>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.movements} aria-labelledby="recent-movements-title">
        <header className={styles.sectionHeader}>
          <h3 id="recent-movements-title">Recent movements</h3>
          <button type="button">View all</button>
        </header>
        <div className={styles.movementList}>
          {stockMovements.map((movement) => (
            <article className={styles.movement} key={movement.title}>
              <span>
                <strong>{movement.title}</strong>
                <small>{movement.time}</small>
              </span>
              <strong className={styles[movement.tone]}>{movement.amount}</strong>
            </article>
          ))}
        </div>
      </section>

      <footer className={styles.actions}>
        <button className={styles.adjust} type="button">
          <SlidersHorizontal size={15} aria-hidden="true" />
          <span>Adjust count</span>
        </button>
        <button className={styles.receive} type="button">
          <ArrowDown size={15} aria-hidden="true" />
          <span>Receive stock</span>
        </button>
      </footer>
    </aside>
  );
}
