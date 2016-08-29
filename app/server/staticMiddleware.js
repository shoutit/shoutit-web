import serveStatic from 'serve-static';
import favicon from 'serve-favicon';
import path from 'path';

const publicDir = path.resolve(__dirname,
  process.env.NODE_ENV === 'production' ? '../../public' : '../../assets'
);

export default function (app) {

  app.use(favicon(`${publicDir}/images/favicons/favicon.ico`));

  // Static assets
  const maxAge = 365 * 24 * 60 * 60;
  if (process.env.NODE_ENV === 'production') {
    app.use('/scripts', serveStatic(`${publicDir}/scripts`, { maxAge }));
    app.use('/images', serveStatic(`${publicDir}/images`, { maxAge }));
    app.use('/styles', serveStatic(`${publicDir}/styles`, { maxAge }));
  } else {
    app.use('/scripts', serveStatic(`${publicDir}/scripts`, { maxAge }));
    app.use('/images', serveStatic(`${publicDir}/images`, { maxAge }));
  }

}
