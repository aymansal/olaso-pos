import {
  ArrowRight,
  CaretDown,
  DotsThree,
  Drop,
  FloppyDisk,
  Leaf,
  LinkBreak,
  PlusCircle,
  Ruler,
} from '@phosphor-icons/react';
import { productOptions } from '../../data/productsData';
import styles from './ProductEditorPanel.module.css';

const optionIcons = {
  drop: Drop,
  plus: PlusCircle,
  ruler: Ruler,
};

export function ProductEditorPanel() {
  return (
    <aside className={styles.panel} aria-labelledby="product-editor-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <small>PRODUCT DETAILS</small>
          <h2 id="product-editor-title">Edit product</h2>
        </span>
        <span className={styles.headerActions}>
          <span className={styles.activeStatus}>
            <span />
            <strong>Active</strong>
          </span>
          <button type="button" aria-label="More product actions">
            <DotsThree size={16} weight="regular" aria-hidden="true" />
          </button>
        </span>
      </header>

      <div className={styles.identity}>
        <span className={styles.identityLeft}>
          <span className={styles.artwork}>
            <Leaf size={25} weight="regular" aria-hidden="true" />
          </span>
          <span className={styles.identityCopy}>
            <strong>Iced Pistachio Matcha</strong>
            <small>MTC-014 · Matcha &amp; Hojicha</small>
          </span>
        </span>
        <span className={styles.priceSummary}>
          <strong>42 MAD</strong>
          <small>Base price</small>
        </span>
      </div>

      <div className={`${styles.divider} ${styles.identityDivider}`} />
      <h3 className={styles.infoTitle}>Product information</h3>

      <label className={`${styles.field} ${styles.nameField}`}>
        <span>Product name</span>
        <input value="Iced Pistachio Matcha" readOnly />
      </label>
      <label className={`${styles.field} ${styles.codeField}`}>
        <span>Product code</span>
        <input value="MTC-014" readOnly />
      </label>
      <label className={`${styles.field} ${styles.priceField}`}>
        <span>Price</span>
        <span className={styles.priceInput}>
          <strong>42</strong>
          <small>MAD</small>
        </span>
      </label>
      <label className={`${styles.field} ${styles.categoryField}`}>
        <span>Category</span>
        <button type="button">
          <span>Matcha &amp; Hojicha</span>
          <CaretDown size={13} weight="regular" aria-hidden="true" />
        </button>
      </label>
      <div className={`${styles.field} ${styles.availabilityField}`}>
        <span>POS availability</span>
        <button type="button" className={styles.availability} aria-pressed="true">
          <strong>On</strong>
          <span><span /></span>
        </button>
      </div>

      <div className={`${styles.divider} ${styles.infoDivider}`} />
      <div className={styles.optionsHeader}>
        <strong>Sizes &amp; options</strong>
        <small>3 groups</small>
      </div>
      <div className={styles.options}>
        {productOptions.map((option) => {
          const Icon = optionIcons[option.icon];

          return (
            <span className={styles.option} key={option.name}>
              <Icon size={14} weight="regular" aria-hidden="true" />
              <span>
                <strong>{option.name}</strong>
                <small>{option.value}</small>
              </span>
            </span>
          );
        })}
      </div>

      <div className={`${styles.divider} ${styles.optionsDivider}`} />
      <div className={styles.recipeHeader}>
        <strong>Recipe &amp; stock</strong>
        <span><span /><small>Not linked</small></span>
      </div>
      <div className={styles.recipeEmpty}>
        <span className={styles.recipeIcon}>
          <LinkBreak size={16} weight="regular" aria-hidden="true" />
        </span>
        <span className={styles.recipeCopy}>
          <strong>Fiche technique not added</strong>
          <small>Link ingredients when the measurements are ready.</small>
        </span>
        <button type="button">
          <span>Set up</span>
          <ArrowRight size={11} weight="regular" aria-hidden="true" />
        </button>
      </div>

      <button type="button" className={styles.save}>
        <FloppyDisk size={16} weight="regular" aria-hidden="true" />
        <span>Save changes</span>
      </button>
    </aside>
  );
}
