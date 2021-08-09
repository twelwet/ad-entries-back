'use strict';

const {client, Settings} = require(`../service/service`);
const { LdapObject } = require(`../constants`);
const { ldapSearch } = require('../utils');

const { Type, Value } = LdapObject;

const queryUsers = async (field, queryValue, adapter = (...params) => params) => {
  const searchOptions = {
    scope: 'sub',
    filter: `(&(${Type.USER}=${Value.USER})(${field}=*${queryValue}*))`,
  };
  return await ldapSearch(client, Settings, searchOptions, adapter)
};

module.exports = queryUsers;
