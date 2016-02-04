
var SUBROUTE = "misc";

module.exports = function () {
	      return {
		      currencies: require("./currencies")(this, SUBROUTE),
		      sortTypes: require("./shoutSortTypes")(this, SUBROUTE),
		      categories: require("./categories")(this, SUBROUTE),
  geocode: require("./geocode")(this, SUBROUTE),
		      suggestions: require("./suggestions")(this, SUBROUTE)
	};
};


