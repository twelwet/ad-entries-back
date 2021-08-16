'use strict';

const moment = require(`moment`);
const {client, Settings} = require(`../service/service`);
const {ldapSearch, saveToFile} = require(`../utils`);

const downLoadAllEntries = async (objType, objValue, adapter = (...props) => props, fileName) => {
  const searchOptions = {
    scope: `sub`,
    filter: `(${objType}=${objValue})`,
  };
  const result = await ldapSearch(client, Settings, searchOptions, adapter);
  const timeStamp = moment(Date.now()).format(`DD.MM.YYYY, HH:mm`);
  await saveToFile(fileName, JSON.stringify({timeStamp, data: result}));
  return result;
};

module.exports = downLoadAllEntries;
