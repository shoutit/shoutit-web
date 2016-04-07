
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

export function parseErrorResponse(err) {
  const error = new Error(err.message);
  error.statusCode = err.response ? err.response.statusCode : 400;
  error.output = {
    message: error.message,
    statusCode: error.statusCode,
    details: err.response ? err.response.body : null,
  };
  if (typeof error.output.details === 'object' &&
    error.output.details.error &&
    error.output.details.error.errors) {
    error.output.errors = error.output.details.error.errors;
  }
  console.error(getErrorSummary(error.output)); // eslint-disable-line
  return error;
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
