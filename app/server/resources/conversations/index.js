import list from './list';
import messages from './messages';
import read from './read';
import unread from './unread';
import del from './delete';
import reply from './reply';

export default function () {
  return {
    load: list(this, 'conversations'),
    messages: messages(this, 'conversations'),
    read: read(this, 'conversations'),
    unread: unread(this, 'conversations'),
    del: del(this, 'conversations'),
    reply: reply(this, 'conversations')
  };
}
