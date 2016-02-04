/**
* Separatng the hustle of conditional statements form the main component. 
* It's to make the popuplist works for listening, listeners and listening-tags lists.
*/
class POPUPLIST_HELPER {
    constructor(type, username) {
      this.type = type;
      this.username = username;
    }

    getTitle() {
      switch(this.type) {
      case "Listening":
        return "Listening to you";
        break;
      case "Listeners" :
        return "Your Listeners";
        break;
      case "Tags" :
        return "Tags you are listening";
        break;
      }
    }

    /**
    * Getting the list of listeners from store based on the type
    * And returning and array of user objects for listeners and listening lists 
    * Or returning an array of tag objects based on type
    *
    * @param {Object} store - the app state containing listens, users and tags from store
    */
    getList(store) {
      const username = this.username;
      const {listens, users, tags} = store;

      if(listens[username]) {
        switch(this.type) {
        case "Listening":
          let listening = listens[username].listening.list;
          return listening.map(item => users[item]);
          break;
        case "Listeners" :
          let listeners = listens[username].listeners.list;
          return listeners.map(item => users[item]);
          break;
        case "Tags" :
          let tagslist = listens[username].tags.list;
          console.log(tagslist);
          return tagslist.map(item => tags[item] && tags[item].tag);
          break;
        }
      }
    }
}

const popuplistHelper = (type, username) => new POPUPLIST_HELPER(type, username);
export default popuplistHelper; 
