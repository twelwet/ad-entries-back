'use strict';

const {FileName} = require(`../constants`);
const {readFromFile} = require(`../utils`);

let users = null;

const getUsers = async () => {
  if (users === null) {
    const fileContent = await readFromFile(FileName.USERS);
    users = JSON.parse(fileContent);
  }
  return users;
};

module.exports = getUsers;
