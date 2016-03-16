
export default function fetchDataForRoutes(routes, params, query, flux, done) {
  const promises = [];

  routes.map(route => {
    const promise = new Promise((resolve, reject) => {
      route.component.fetchData(flux.actions, params, query, err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
    promises.push(promise);
  });

  Promise.all(promises).then(
    () => done(),
    err => done(err) // fail-fast if one of the route's fetchData error'ed
  );
}
