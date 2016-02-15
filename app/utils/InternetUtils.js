

const IPv4Regexp = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$)/;

export function getValidIPv4Address(address) {
  const match = IPv4Regexp.exec(address);
  if (!match) {
    return "";
  }
  return match[0];
}
