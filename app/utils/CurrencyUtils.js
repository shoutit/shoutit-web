import currencyFormatter from 'currency-formatter';

export function formatPrice(price, currency) {
  if (!price) {
    return 'free';
  }
  price = price / 100;
  return currencyFormatter.format(price, {
    code: currency, precision: Number.isInteger(price) ? 0 : 2,
  });
}
