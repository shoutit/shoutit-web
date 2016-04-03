import request from '../utils/request';
import { parseErrorResponse } from '../utils/APIUtils';

export default {
  name: 'shouts',
  read: (req, resource, params = {}, config, callback) => {
    const url = params.endpoint || '/shouts';
    if (params.searchParams && params.searchParams.filters) {
      Object.keys(params.searchParams.filters).forEach(slug => {
        params.searchParams[slug] = params.searchParams.filters[slug];
      });
      delete params.searchParams.filters;
    }
    request
      .get(url)
      .query(!params.endpoint ? params.searchParams : null)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseErrorResponse(err));
        }
        return callback(null, res.body);
      });
  },
};
