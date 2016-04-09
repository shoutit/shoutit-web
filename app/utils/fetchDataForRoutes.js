
// Get the route's component, coming it from component or getComponent prop
function getRouteComponent(route) {
  if (!route.component && !route.getComponent) {
    return null;
  }
  if (route.component) {
    return route.component;
  }
  const Component = route.getComponent(null, () => {});
  if (!Component) {
    throw new Error('To fetch data for routes, getComponent must return the component');
  }
  return Component;
}

export default function fetchDataForRoutes(routes, params, query, store, done) {
  const promises = routes
    .map(route => getRouteComponent(route))
    .filter(component => component && component.fetchData)
    .map(component => component.fetchData(store.dispatch, store.getState(), params, query));

  Promise.all(promises).then(
    () => done(),
    err => done(err) // fail-fast if one of the route's fetchData error'ed
  ).catch(err => done(err));
}
