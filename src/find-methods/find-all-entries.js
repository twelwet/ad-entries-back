'use strict';

const {client, Settings} = require(`../service/service`);
const { ldapSearch, saveToFile } = require('../utils');

const findAllEntries = async (objType, objValue, adapter = (...props) => props) => {
  const searchOptions = {
    scope: 'sub',
    filter: `(${objType}=${objValue})`,
  };
  const result = await ldapSearch(client, Settings, searchOptions, adapter);
  await saveToFile(`${objValue}s.json`, JSON.stringify(result));
  return result;
};

module.exports = findAllEntries;
