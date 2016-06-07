import moment from 'moment';
import { toDate } from 'unix-timestamp';

/**
 * Properly format a `created_date` date.
 */
export function formatCreatedAt(m, now = moment()) {

  if (typeof m !== 'object') {
    m = moment.unix(m);
  }

  if (m.isSame(now, 'day')) {
    return m.format('LT');
  }

  if (m.isSame(now, 'week')) {
    return m.format('ddd');
  }

  if (m.isSame(now, 'year')) {
    return m.format('ll').replace(m.format('YYYY'), '').replace(/[^\w\d ]*/ig, '').trim();
  }

  return m.format('l');
}

export function getUnixTime(date = Date.now()) {
  return Math.floor(date / 1000);
}

/**
 * Return `true` if two dates are the same day, ignoring the time.
 *
 * @param  {Number}  d1
 * @param  {Number}  d2
 * @return {Boolean}
 */
export function isSameDay(d1, d2) {
  if (!d1 || !d2) {
    return false;
  }
  const date1 = toDate(d1);
  const date2 = toDate(d2);
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
}
