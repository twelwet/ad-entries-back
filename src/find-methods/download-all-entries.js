'use strict';

const {client, Settings} = require(`../service/service`);
const { ldapSearch, saveToFile } = require('../utils');

const downLoadAllEntries = async (objType, objValue, adapter = (...props) => props, fileName) => {
  const searchOptions = {
    scope: 'sub',
    filter: `(${objType}=${objValue})`,
  };
  const result = await ldapSearch(client, Settings, searchOptions, adapter);
  await saveToFile(fileName, JSON.stringify(result));
  return result;
};

module.exports = downLoadAllEntries;
