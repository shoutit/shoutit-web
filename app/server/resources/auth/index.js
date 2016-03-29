import changePassword from './changePassword';

export default function () {
  return {
    change: changePassword(this, 'auth')
  };
}
