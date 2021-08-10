'use strict';

const {client, Settings} = require(`../service/service`);
const { ldapSearch, saveToFile } = require('../utils');

const findAllEntries = async (objType, objValue, adapter = (...props) => props) => {
  const searchOptions = {
    scope: 'sub',
    filter: `(${objType}=${objValue})`,
  };
  return await ldapSearch(client, Settings, searchOptions, adapter);
};

module.exports = findAllEntries;
