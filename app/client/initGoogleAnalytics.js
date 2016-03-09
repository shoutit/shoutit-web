export default function(projectId) {
  let ga = window.ga = window.ga || function () { //eslint-disable-line
    (ga.q = ga.q || []).push(arguments);
  };
  ga.l = new Date();
  ga("create", projectId, "auto");
  return ga;
}
