'use strict';

const {client, Settings} = require(`../service/service`);
const {ldapSearch} = require(`../utils`);


const queryEntries = async (typeName, typeValue, field, queryValue, adapter = (...params) => params) => {
  const searchOptions = {
    scope: `sub`,
    filter: `(&(${typeName}=${typeValue})(${field}=*${queryValue}*))`,
  };
  return await ldapSearch(client, Settings, searchOptions, adapter);
};

module.exports = queryEntries;
