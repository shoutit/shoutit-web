import debug from 'debug';

const errorParserLog = debug('shoutit:parseApiError');

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

export function parseApiError(err, info) {
  errorParserLog('Parsing API %s error', err.message, info || 'No additional info provided');
  let parsedError = err;
  if (err.response && err.response.body && err.response.body.error) {
    errorParserLog('Found a response error from API');
    parsedError = new Error(err.response.body.error.message);
    const apiError = err.response.body.error;
    if (apiError.message.match(/^Resource not found/)) {
      // Temp fix waiting for https://github.com/shoutit/shoutit-api/issues/79
      apiError.code = 404;
    }
    // This is what will be actually sent to clients
    parsedError.output = {
      ...info,
      statusCode: apiError.code,
      ...apiError,
    };
    parsedError.body = parsedError.output;
  } else if (err.response && err.response.error) {
    errorParserLog('Found a generic response error', err);
    parsedError = new Error(err.message);
    parsedError.statusCode = err.status || 400;
    parsedError.output = {
      ...info,
      statusCode: err.status || 500,
      message: err.message,
    };
    parsedError.body = parsedError.output;
  }
  errorParserLog('Error has been parsed', parsedError);
  return parsedError;
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
