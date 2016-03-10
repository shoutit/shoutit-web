
const pathRE = /^(.+?)(\.[^\.]+)$/; // $1=filename $2=.extension

export function getVariation(path, variation="medium") {
  return path.replace(pathRE, `$1_${variation}$2`);
}
