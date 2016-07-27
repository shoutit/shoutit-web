const regexp = new RegExp(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);

/**
 * Convert #AARRGGBB to [r, g, b, a]
 *
 * @export
 * @param {any} hex
 * @returns
 */
export default function hexToRgba(hex) {
  const match = hex.match(regexp);
  const r = parseInt(match[2], 16);
  const g = parseInt(match[3], 16);
  const b = parseInt(match[4], 16);
  const a = parseInt(match[1], 16) / 255;
  return [r, g, b, parseFloat(a.toFixed(2))];
}

/**
 * Convert #AARRGGBB to rgba(r,g,b,a)
 *
 * @export
 * @param {any} hex
 * @returns
 */
export function hexToCSSRgba(hex) {
  return `rgba(${hexToRgba(hex).join(',')})`;
}
