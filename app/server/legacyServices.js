import express from 'express';
import resetPass from './services/resetPassword';
import apiRouter from './routes';
import { uploadImageMiddleware, deleteImageMiddleware } from './services/images';

export default function legacyServices(app) {
  const servicesRouter = new express.Router();

  servicesRouter.get('/reset_password', resetPass.get);
  servicesRouter.post('/reset_password', resetPass.post);

  servicesRouter.post('/images/:resourceType', uploadImageMiddleware);
  servicesRouter.delete('/images', deleteImageMiddleware);

  app.use('/services', servicesRouter);
  app.use('/api', apiRouter);
}
