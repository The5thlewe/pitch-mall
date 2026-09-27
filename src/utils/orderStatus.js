// Order lifecycle is derived from elapsed time since the order was placed
// rather than a one-off setTimeout chain, so the status is still correct
// after a page refresh instead of resetting.
export const ORDER_STAGES = {
  PLACED: 'PLACED',
  PREPARING: 'PREPARING',
  READY_FOR_DELIVERY: 'READY_FOR_DELIVERY',
  DELIVERED: 'DELIVERED'
};

const PREPARING_AFTER_MS = 5000;
const READY_AFTER_MS = 15000;
const DELIVERED_AFTER_MS = 30000;

export const ORDER_STAGE_LABEL = {
  PLACED: 'Order placed',
  PREPARING: 'Preparing your order',
  READY_FOR_DELIVERY: 'Ready for delivery',
  DELIVERED: 'Delivered'
};

export function deriveOrderStatus(order) {
  if (!order?.placedAt) return ORDER_STAGES.PLACED;
  const elapsed = Date.now() - new Date(order.placedAt).getTime();
  if (elapsed >= DELIVERED_AFTER_MS) return ORDER_STAGES.DELIVERED;
  if (elapsed >= READY_AFTER_MS) return ORDER_STAGES.READY_FOR_DELIVERY;
  if (elapsed >= PREPARING_AFTER_MS) return ORDER_STAGES.PREPARING;
  return ORDER_STAGES.PLACED;
}
