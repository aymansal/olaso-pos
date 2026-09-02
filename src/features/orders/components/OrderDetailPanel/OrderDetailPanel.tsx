import { Clock, InfoCircle, Package, Printer, Receipt, RotateCcw, ShoppingBag, Store } from '@boxicons/react';
import { useState } from 'react';
import type { OrderHistoryRecord } from '../../../../data/orderHistory';
import { useLanguage, useT } from '../../../../lib/locale';
import { formatTime } from '../../../../lib/date';
import { formatMoney } from '../../../../lib/money';
import styles from './OrderDetailPanel.module.css';
import { CancellationDialog } from '../CancellationDialog/CancellationDialog';

function serviceLabel(order: OrderHistoryRecord) {
  if (order.receipt.serviceType === 'dine-in') return 'Dine in';
  if (order.receipt.serviceType === 'take-away') return 'Take away';
  return 'Order online';
}

function stateLabel(order: OrderHistoryRecord) {
  if (order.syncState === 'failed') return 'Needs sync';
  if (order.syncState === 'pending') return 'Waiting to sync';
  if (order.status === 'cancelled' || order.status === 'refunded') {
    return 'Cancelled';
  }
  return 'Completed';
}

export function OrderDetailPanel({
  order,
  productImages,
  reprinting,
  cancelling,
  onReprint,
  onCancel,
}: {
  order?: OrderHistoryRecord;
  productImages: Record<string, string>;
  reprinting: boolean;
  cancelling: boolean;
  onReprint: (order: OrderHistoryRecord) => Promise<void>;
  onCancel: (order: OrderHistoryRecord, reason: string) => Promise<void>;
}) {
  const t = useT();
  const language = useLanguage();
  const [cancellationOpen, setCancellationOpen] = useState(false);

  if (!order) {
    return (
      <aside className={`${styles.panel} ${styles.empty}`} aria-live="polite">
        <Receipt width={28} height={28} aria-hidden="true" />
        <strong>{t('No order selected')}</strong>
        <span>{t('Choose a saved order to inspect its receipt snapshot.')}</span>
      </aside>
    );
  }

  const itemCount = order.receipt.lines.reduce(
    (total, line) => total + line.quantity,
    0,
  );
  const createdAt = formatTime(order.receipt.completedAt, language);
  const canReprint = order.status === 'completed' && Boolean(order.printState);
  const canCancel = order.status === 'completed' && Boolean(order.printState);
  const statusTone = order.syncState !== 'synced' || order.status !== 'completed'
    ? styles.statusAttention
    : styles.statusComplete;
  const printNote = order.printState === 'failed'
    ? `${t('Printer unavailable')} · ${t('reprint available')}`
    : order.printState === 'pending'
      ? `${t('Receipt pending')} · ${t('reprint available')}`
      : order.printState === 'printed'
        ? t(
            order.printAttemptCount === 1
              ? 'Receipt sent · {count} attempt'
              : 'Receipt sent · {count} attempts',
            { count: order.printAttemptCount },
          )
        : t('Reprint unavailable on this tablet');
  const syncStateNote = t(
    order.syncState === 'synced'
      ? 'Cloud synced'
      : order.syncState === 'failed'
        ? 'Needs sync'
        : 'Waiting to sync',
  );
  const ServiceIcon = order.receipt.serviceType === 'take-away'
    ? ShoppingBag
    : Store;
  const tenderMethods = new Set(
    order.receipt.tenders?.map((tender) => tender.paymentMethod) ?? [],
  );
  const paymentLabel = tenderMethods.size > 1
    ? 'Mixed'
    : order.receipt.tenders?.[0]?.paymentMethod ?? order.receipt.paymentMethod;

  return (
    <aside className={styles.panel} aria-labelledby="selected-order-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <small>{t('SELECTED ORDER')}</small>
          <h2 id="selected-order-title">{order.receipt.receiptNumber}</h2>
        </span>
        <span className={styles.headerActions}>
          <span className={`${styles.orderStatus} ${statusTone}`}>
            <span />
            <strong>{t(stateLabel(order))}</strong>
          </span>
        </span>
      </header>

      <div className={styles.metadata}>
        <span className={styles.metaItem}>
          <ServiceIcon width={16} height={16} aria-hidden="true" />
          <small>{t('Service')}</small>
          <strong>{t(serviceLabel(order))}</strong>
        </span>
        <span className={styles.metaItem}>
          <Clock width={16} height={16} aria-hidden="true" />
          <small>{t('Created')}</small>
          <strong>{createdAt}</strong>
        </span>
      </div>

      <div className={styles.body}>
      <div className={styles.itemsHeader}>
        <strong>{t('Order items')}</strong>
        <small>{itemCount} {t(itemCount === 1 ? 'item' : 'items')}</small>
      </div>

      <div className={styles.items}>
        {order.receipt.lines.map((item, index) => {
          const options = [
            item.complimentary ? t('Offert') : '',
            item.sizeName,
            ...item.modifiers.map((modifier) => modifier.optionName),
          ].filter(Boolean).join(', ');
          return (
            <article className={styles.item} key={`${item.productName}-${index}`}>
              <span className={`${styles.itemIcon} ${index === 0 ? styles.itemIconActive : ''}`}>
                {item.productId && productImages[item.productId] ? (
                  <img src={productImages[item.productId]} alt="" />
                ) : (
                  <Package width={17} height={17} aria-hidden="true" />
                )}
              </span>
              <span className={styles.itemCopy}>
                <strong>{item.productName}</strong>
                <small>
                  {options ? `${options} · ` : ''}
                  {formatMoney(item.unitPriceCentimes)} × {item.quantity}
                </small>
              </span>
              <strong className={styles.itemTotal}>
                {formatMoney(item.complimentary ? 0 : item.lineTotalCentimes)}
              </strong>
              {index < order.receipt.lines.length - 1
                ? <span className={styles.itemDivider} />
                : null}
            </article>
          );
        })}
      </div>

      <div className={`${styles.divider} ${styles.paySplit}`} />

      <div className={styles.paymentHeader}>
        <strong>{t('Payment')}</strong>
        <span>
          <span />
          <small>{t(paymentLabel)}</small>
        </span>
      </div>

      <dl className={styles.payment}>
        {order.receipt.discountCentimes > 0 ? (
          <>
            <div>
              <dt>{t('Subtotal')}</dt>
              <dd>{formatMoney(order.receipt.subtotalCentimes)}</dd>
            </div>
            <div>
              <dt>{t('Offert')}</dt>
              <dd>-{formatMoney(order.receipt.discountCentimes)}</dd>
            </div>
          </>
        ) : null}
        {order.receipt.tenders?.flatMap((tender, index) => {
          const many = (order.receipt.tenders?.length ?? 0) > 1;
          return [
            <div key={`method-${index}`}>
              <dt>{many
                ? `${index + 1} · ${t(tender.paymentMethod)}`
                : t(tender.paymentMethod)}</dt>
              <dd>{formatMoney(tender.dueCentimes)}</dd>
            </div>,
            ...(tender.paymentMethod === 'Cash' ? [
              <div key={`given-${index}`}>
                <dt>{t('Given')}</dt>
                <dd>{formatMoney(tender.amountCentimes)}</dd>
              </div>,
              <div key={`change-${index}`}>
                <dt>{t('Change')}</dt>
                <dd>{formatMoney(tender.changeCentimes)}</dd>
              </div>,
            ] : []),
          ];
        })}
        <div className={styles.total}>
          <dt>{t('Total')}</dt>
          <dd>{formatMoney(order.receipt.totalCentimes)}</dd>
        </div>
      </dl>

      <div className={styles.divider} />

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.reprint}
          disabled={!canReprint || reprinting}
          title={canReprint ? t('Print the immutable saved receipt') : printNote}
          onClick={() => void onReprint(order)}
        >
          <Printer width={17} height={17} aria-hidden="true" />
          <span>{reprinting ? t('Printing…') : t('Reprint')}</span>
        </button>
        <button type="button" className={styles.cancelOrder} disabled={!canCancel || cancelling} onClick={() => setCancellationOpen(true)}>
          <RotateCcw width={17} height={17} aria-hidden="true" />
          <span>{cancelling ? t('Cancelling…') : t('Cancel')}</span>
        </button>
      </div>

      <div className={styles.stockNote} title={order.printError ? t(order.printError) : printNote}>
        <InfoCircle width={13} height={13} aria-hidden="true" />
        <span>{printNote} · {syncStateNote}</span>
      </div>
      </div>
      {cancellationOpen ? (
        <CancellationDialog
          receiptNumber={order.receipt.receiptNumber}
          onClose={() => setCancellationOpen(false)}
          onConfirm={(reason) => onCancel(order, reason)}
        />
      ) : null}
    </aside>
  );
}
