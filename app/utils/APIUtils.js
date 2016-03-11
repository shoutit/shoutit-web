
const pathRE = /^(.+?)(\.[\w]*)$/; // $1=filename $2=.extension

export function getVariation(path, variation="medium") {
  if (!pathRE.exec(path)) {
    return `${path}_${variation}`;
  }
  return path.replace(pathRE, `$1_${variation}$2`);
}
