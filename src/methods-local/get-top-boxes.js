'use strict';

const { readFromFile } = require('../utils');
const { FileName } = require('../constants');

const getTopBoxes = async (count) => {
  try {
    return JSON.parse(await readFromFile(FileName.USERS))
      .sort((a, b) => b.user.person.emailBoxSize - a.user.person.emailBoxSize)
      .slice(0, count);

  } catch(err) {
    return err.message;
  }
};

module.exports = getTopBoxes;
