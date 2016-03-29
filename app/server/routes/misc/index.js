import express from 'express';
import resources from '../../resources';

const router = express.Router();
const ShoutClient = resources.misc();

router.route('/geocode')
    .get(require('./geocode').default(ShoutClient));

router.route('/suggestions')
    .get(require('./suggestions').default(ShoutClient));

export default router;
