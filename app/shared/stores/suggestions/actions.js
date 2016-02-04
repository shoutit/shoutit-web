import consts from './consts';

export default {
    getSuggestions() {
        this.dispatch(consts.GET_SUGGESTIONS);
    }
}