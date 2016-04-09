import express from 'express';

import shouts from './shouts';
import users from './users';
import tags from './tags';
import misc from './misc';

const apiRouter = new express.Router();

apiRouter.use('/shouts', shouts);
apiRouter.use('/users', users);
apiRouter.use('/tags', tags);
apiRouter.use('/misc', misc);

export default apiRouter;
