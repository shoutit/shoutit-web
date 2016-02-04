/**
 * Created by mo on 03.09.2015.
 */


/**
 * Return home directory for current user.
 *
 * @return {String}
 */

exports.getUserHome = function getUserHome() {
  return process.env[(process.platform == "win32") ? "USERPROFILE" : "HOME"];
};
