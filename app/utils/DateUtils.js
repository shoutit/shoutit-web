export function isSameDay(d1, d2) {
  if (!d1 || !d2) {
    return false;
  }
  return d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();
}

export function isSameWeek(d1, d2) {
  if (!d1 || !d2) {
    return false;
  }
  const timeDiff = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24)) < 7;
}

export function isSameYear(d1, d2) {
  if (!d1 || !d2) {
    return false;
  }
  return d1.getFullYear() === d2.getFullYear();
}
