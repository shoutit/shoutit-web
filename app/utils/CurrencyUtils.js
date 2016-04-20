import currencyFormatter from 'currency-formatter';

export function formatPrice(price, currency) {
  if (!price) {
    return 'free';
  }
  return currencyFormatter.format(price / 100, {
    code: currency, precision: Number.isInteger(price) ? 0 : 2,
  });
}
