import { configure } from '@kadira/storybook';

import '../app/styles/main.scss';
import './storybook.scss';

function loadStories() {
  require('../stories/Button');
  require('../stories/Icon');
  require('../stories/Chat.ReplyFormToolbar');
}

configure(loadStories, module);
