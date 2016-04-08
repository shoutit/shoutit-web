
const pathRE = /^(.+?)(\.[\w]*)$/; // $1=filename $2=.extension

export function getVariation(path, variation = 'medium') {
  if (!pathRE.exec(path)) {
    return `${path}_${variation}`;
  }
  return path.replace(pathRE, `$1_${variation}$2`);
}

export function getErrorSummary(err) {
  const summary = [];
  summary.push('');
  summary.push(`Message:     ${err.message}`);
  summary.push(`Time:        ${(new Date()).toISOString()}`);
  summary.push(`Status code: ${err.statusCode}`);
  if (err.details && err.details.error) {
    const details = err.details.error;
    summary.push(`Request ID:  ${details.request_id}`);
    summary.push(`${details.developer_message}`);
  }
  return summary.join('\n');
}

export function parseApiError(err) {
  if (err.response && err.response.body && err.response.body.error) {
    const apiError = err.response.body.error;
    const error = new Error(apiError.message);
    error.statusCode = apiError.code;
    // use output and body to get the api error both server and client side
    // with fetchr https://gitter.im/yahoo/fluxible?at=570816a18b7b2f457634fd4b
    error.output = apiError;
    error.body = apiError;
    return error;
  }
  return err;
}

export function getErrorsByLocation(apiError, location) {
  if (!apiError.hasOwnProperty('errors')) {
    return undefined;
  }
  return apiError.errors.filter(error => error.location === location);
}

export function getErrorLocations(apiError) {
  const locations = [];
  if (!apiError.hasOwnProperty('errors')) {
    return locations;
  }
  for (let i = 0; i < apiError.errors.length; i++) {
    if (apiError.errors[i].location && locations.indexOf(apiError.errors[i].location) === -1) {
      locations.push(apiError.errors[i].location);
    }
  }
  return locations;
}
