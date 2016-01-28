import Fluxxor from 'fluxxor';
import consts from './consts';

var SuggestionsStore = Fluxxor.createStore({
    initialize(props) {
        this.state = {
            loading: false,
            suggestion: {}
        };

        if(props.suggestions) {
            // TODO: load suggestions here
        }

        this.bindActions(
            consts.GET_SUGGESTIONS, this.onGetSuggestions
        );
    },

    onGetSuggestion(payload) {
        // TODO: get location from location store
        const location = null;
        // TODO: load suggestios here
        this.state.loading = true;
        this.emit("change");
    },

    serialize() {
        return JSON.stringify(this.state);
    },

    hydrate(json) {
        this.state = JSON.parse(json);
    },

    getState() {
        return this.state;
    }
});

export default SuggestionsStore;
