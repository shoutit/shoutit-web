import moment from 'moment';

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

export function getUnixTime() {
  return Math.floor(Date.now() / 1000);
}
