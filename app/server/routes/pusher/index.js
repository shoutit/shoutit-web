import express from 'express';
import resources from '../../resources';

const router = express.Router();
const ShoutClient = resources.pusher();

router.route('/auth')
  .post(require('./auth').default(ShoutClient));

export default router;
