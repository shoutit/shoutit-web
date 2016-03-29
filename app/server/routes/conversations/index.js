import express from 'express';
import resources from '../../resources';

const router = express.Router();
const ShoutClient = resources.conversations();

router.route('/')
  .get(require('./list').default(ShoutClient));

router.route('/:id')
  .delete(require('./delete').default(ShoutClient));

router.route('/:id/messages')
  .get(require('./messages').default(ShoutClient));

router.route('/:id/read')
  .post(require('./read').default(ShoutClient))
  .delete(require('./unread').default(ShoutClient));

router.route('/:id/reply')
  .post(require('./reply').default(ShoutClient));

export default router;
