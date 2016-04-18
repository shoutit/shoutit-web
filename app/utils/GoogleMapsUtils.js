export function createLinkToGoogleMaps(location) {
  let ll = '';
  let q = [];
  let search = '';

  if (location.latitude && location.longitude) {
    ll = `ll=${location.latitude},${location.longitude}`;
  }
  if (location.address) {
    q.push(encodeURIComponent(location.address));
  }
  if (location.city) {
    q.push(encodeURIComponent(location.city));
  }
  if (location.state) {
    q.push(encodeURIComponent(location.state));
  }
  if (location.postal_code) {
    q.push(location.postal_code);
  }
  if (location.country) {
    q.push(encodeURIComponent(location.country));
  }
  q = q.join(',%20');

  if (ll) {
    search += `&${ll}`;
  }

  if (q) {
    search += `&q=${q}`;
  } else {
    search += `&q=loc:${location.latitude},${location.longitude}`;
  }

  return `https://www.google.com/maps?${search}`;
}
