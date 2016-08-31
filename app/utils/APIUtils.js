import debug from 'debug';

const errorParserLog = debug('shoutit:parseApiError');

const pathRE = /^(.+?)(\.[\w]*)$/; // $1=filename $2=.extension

export function getVariation(path, variation = 'medium') {
  if (!pathRE.exec(path)) {
    return `${path}_${variation}`;
  }
  return path.replace(pathRE, `$1_${variation}$2`);
}

export function parseApiError(err, info) {
  errorParserLog('Parsing API %s error', err.message, info || 'No additional info provided');
  let parsedError = err;
  if (err.response && err.response.body && err.response.body.error) {
    errorParserLog('Found a response error from API');
    parsedError = new Error(err.response.body.error.message);
    const apiError = err.response.body.error;
    parsedError.statusCode = apiError.code || 500;
    // This is what will be actually sent to clients
    parsedError.output = {
      ...info,
      statusCode: apiError.code,
      ...apiError,
    };
  } else if (err.response && err.response.error) {
    errorParserLog('Found a generic response error', err);
    parsedError = new Error(err.message);
    parsedError.statusCode = err.status || 500;
    parsedError.output = {
      ...info,
      statusCode: err.status || 500,
      message: err.message,
    };
  }
  errorParserLog('Error has been parsed', parsedError);
  return parsedError;
}

export function getErrorsByLocation(apiError, locations) {
  if (typeof locations === 'string') {
    locations = [locations];
  }
  if (!apiError.hasOwnProperty('errors')) {
    return undefined;
  }
  return apiError.errors.filter(error => locations.indexOf(error.location) !== -1);
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
