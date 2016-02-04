/**
 * Created by Philip on 26.06.2015.
 */

let loggedUser;

module.exports = function (newUser) {
	      if (newUser) {
		      loggedUser = newUser;
		      module.exports = {
			      getUser() {
				      return loggedUser;
			}
		};
	}
};
