import express from 'express';
import resources from '../../resources';

const router = express.Router();
const ShoutClient = resources;

router.route('/:term')
  .get(require('./searchAll').default(ShoutClient));

export default router;
