
const pathRE = /^(.+?)(\.[\w]*)$/; // $1=filename $2=.extension

export function getVariation(path, variation = 'medium') {
  if (!pathRE.exec(path)) {
    return `${path}_${variation}`;
  }
  return path.replace(pathRE, `$1_${variation}$2`);
}

export function parseErrorResponse(err) {
  const error = new Error(err.message);
  error.statusCode = err.response ? err.response.statusCode : 400;
  error.output = {
    message: error.message,
    statusCode: error.statusCode,
    details: err.response ? err.response.body : null,
  };
  return error;
}
