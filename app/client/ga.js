/**
 * Created by Philip on 07.05.2015.
 */

export default function(projectId) {
    let ga = window.ga = window.ga || function () {
            (ga.q = ga.q || []).push(arguments);
        };
    ga.l = new Date();
    ga('create', projectId, 'auto');

    return ga;
}
