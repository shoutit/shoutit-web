/* eslint no-console: 0 */

import { getValidIPv4Address } from '../../../utils/InternetUtils';

export default function (client) {
  return (req, res) => {
    const options = {};
    const remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const ip = getValidIPv4Address(remoteAddress);
    if (ip) {
      options.headers = {
        'X-Forwarded-For': ip
      };
      console.log('Forwarding ip %s', ip);
    }

    client.geocode(req.session, req.query, options)
      .on('success', data => res.json(data))
      .on('fail', (data, response) => res.status(response.statusCode).json(data))
      .on('error', (err) => {
        res.status(500).send(err);
      });
  };
}
