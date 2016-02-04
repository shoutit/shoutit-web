import request from "superagent";

const PREFIX = "/api/tags";

export default {
	      list(query) {
		      return request
			.get(PREFIX + "/")
			.query(query);
	},

	      get(tagName) {
		      return request
			.get(PREFIX + "/" + tagName);
	},

	      listen(tagName) {
		      return request
			.post(PREFIX + "/" + tagName + "/listen");
	},

	      unlisten(tagName) {
		      return request
			.del(PREFIX + "/" + tagName + "/listen");
	},

	      getListeners(tagName) {
		      return request
			.get(PREFIX + "/" + tagName + "/listeners");
	},

	      getShouts(tagName, query) {
		      return request
			.get(PREFIX + "/" + tagName + "/shouts")
			.query(query);
	},

	      loadSpriteInfo(hash) {
		      return request.get("/sprites/" + hash);
	},

	      requestSpriting(images) {
		      return request.post("/sprites")
			.send({images});
	}
};
