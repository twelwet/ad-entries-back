'use strict';

const ldap = require('ldapjs-promise');
require(`dotenv`).config();

const Settings = {
  URL: process.env.DMN_URL,
  BASE_DN: process.env.DMN_BASE_DN,
  USERNAME: process.env.DMN_USERNAME,
  PASSWORD: process.env.DMN_PASSWORD,
};

module.exports = {
  client: ldap.createClient({url: Settings.URL}),
  Settings,
};
