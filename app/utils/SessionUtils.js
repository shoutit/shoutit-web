import { now } from 'unix-timestamp';

export function didFacebookTokenExpire(profile) {
  if (!profile.linkedAccount || !profile.linkedAccount.facebook) {
    return false;
  }
  if (now() < profile.linkedAccount.facebook.expiresAt) {
    return false;
  }
  return true;
}

