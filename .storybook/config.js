import { configure } from '@kadira/storybook';

import 'normalize.css/normalize.css';
import '../app/styles/main.scss';

function loadStories() {
  require('../stories/Button');
  require('../stories/Icon');
}

configure(loadStories, module);
