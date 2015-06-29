/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */

var name = process.env.NODE_ENV === "development" ? '[Dev] Shoutit Webserver' : 'Shoutit Webserver';

exports.config = {
  /**
   * Array of application names.
   */
  app_name: [name],
  /**
   * Your New Relic license key.
   */
  license_key: '20539b4798f35e738173b849d6be9b6d874a0e7f',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  }
};
