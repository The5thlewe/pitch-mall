export function formatNaira(amount) {
  const value = Number.isFinite(amount) ? amount : 0;
  return '₦' + value.toLocaleString('en-NG');
}
