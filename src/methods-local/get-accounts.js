'use strict';

const moment = require('moment');
const { readFromFile } = require('../utils');
const { isDisabled, isEnabled, getYears, mapEntriesToYears } = require('./utils');
const { FileName } = require('../constants');

const getAccounts = async () => {
  try {
    const allEntries = JSON.parse(await readFromFile(FileName.USERS));
    const emailEntries = allEntries.filter((entry) => entry.user.person.email);

    const disabledUsers = allEntries.filter((entry) => isDisabled(entry.user.account.status));
    const enabledUsers = allEntries.filter((entry) => isEnabled(entry.user.account.status));

    const userCreations = allEntries.map((entry) => `year${moment(entry.objectInfo.whenCreated).format('YYYY')}`);

    const yearsOfUsersCreation = getYears(userCreations);

    const userLastLogons = allEntries.map((entry) => entry.user.account.lastLogon === null ? 'never' : `year${moment(entry.user.account.lastLogon).format('YYYY')}`);

    const yearsOfUsersLastLogons = getYears(userLastLogons);

    return {
      count: {
        all: allEntries.length,
        enabled: enabledUsers.length,
        disabled: disabledUsers.length,
        withEmails: emailEntries.length,
      },
      creation: mapEntriesToYears(yearsOfUsersCreation, userCreations),
      lastLogon: mapEntriesToYears(yearsOfUsersLastLogons, userLastLogons)
    };

  } catch(err) {
    return err.message;
  }
};

module.exports = getAccounts;
