import Fluxxor from 'fluxxor';
import consts from './consts';
import client from './client';

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

    onGetSuggestions(payload) {
        // TODO: should get location for logged user from their profile for server rendering
        // It is happening now but we need it before onComponentDidMount
        const location = this.flux.store('locations').getState().current;

        client.getSuggestions({
            country: location.country,
            state: location.state,
            city: location.city,
            page_size: 8
            }).end((err, res) => {
                if(err) {
                    console.error(err);
                } else {
                    this.state.suggestion = res.body;
                    this.state.loading = false;

                    this.emit('change');
                }
            });

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
