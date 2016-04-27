import { configure } from '@kadira/storybook';
import 'normalize.css/normalize.css';
import '../app/styles/main.scss';

function loadStories() {
  require('../app/ui/stories/Button');
  require('../app/ui/stories/Icon');
  // require as many stories as you need.
}

configure(loadStories, module);
