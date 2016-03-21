
export default function fetchDataForRoutes(routes, params, query, store, done) {
  const promises = routes
    .filter(route => route.component && route.component.fetchData)
    .map(route => route.component.fetchData(store, params, query));

  Promise.all(promises).then(
    () => done(),
    err => done(err) // fail-fast if one of the route's fetchData error'ed
  );
}
