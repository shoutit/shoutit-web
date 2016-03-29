import me from './me';
import get from './get';
import search from './search';
import del from './delete';
import update from './update';
import updateImage from './updateImage';
import listen from './listen';
import unlisten from './unlisten';
import getListeners from './getListeners';
import getListening from './getListening';
import sendMessage from './sendMessage';

export default function () {
  return {
    me: me(this, 'users'),
    get: get(this, 'users'),
    search: search(this, 'users'),
    del: del(this, 'users'),
    update: update(this, 'users'),
    updateImage: updateImage(this, 'users'),
    listen: listen(this, 'users'),
    unlisten: unlisten(this, 'users'),
    getListeners: getListeners(this, 'users'),
    getListening: getListening(this, 'users'),
    sendMessage: sendMessage(this, 'users')
  };
}
