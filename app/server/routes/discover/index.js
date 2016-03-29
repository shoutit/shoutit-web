import express from 'express';
import resources from '../../resources';

const router = express.Router();
const ShoutClient = resources.discover();

router.route('/')
    .get(require('./list').default(ShoutClient));

router.route('/:pk')
    .get(require('./get').default(ShoutClient));


module.exports = router;
