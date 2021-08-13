'use strict';

const moment = require('moment');
const { readFromFile } = require('../utils');
const { reducer, getBoxSize, isDisabled, isEnabled, getYears, mapEntriesToYears } = require('./utils');
const { FileName } = require('../constants');

const getEssential = async () => {
  try {
    const allEntries = JSON.parse(await readFromFile(FileName.USERS));
    const emailEntries = allEntries.filter((entry) => entry.user.person.email);

    const allBoxesSize = emailEntries
      .filter((entry) => entry.user.person.emailBoxSize)
      .map((entry) => getBoxSize(entry.user.person.emailBoxSize)).reduce(reducer);

    const disabledUsers = allEntries.filter((entry) => isDisabled(entry.user.account.status));
    const enabledUsers = allEntries.filter((entry) => isEnabled(entry.user.account.status));

    const disabledEmails = emailEntries.filter((entry) => isDisabled(entry.user.account.status));
    const enabledEmails = emailEntries.filter((entry) => isEnabled(entry.user.account.status));

    const userCreations = allEntries.map((entry) => moment(entry.objectInfo.whenCreated).format('YYYY'));
    const emailCreations = emailEntries.map((entry) => moment(entry.objectInfo.whenCreated).format('YYYY'));

    const yearsOfUsersCreation = getYears(userCreations);
    const yearsOfEmailsCreation = getYears(emailCreations);

    const userLastLogons = allEntries.map((entry) => entry.user.account.lastLogon === null ? 'never' : moment(entry.user.account.lastLogon).format('YYYY'));
    const emailLastLogons = emailEntries.map((entry) => entry.user.account.lastLogon === null ? 'never' : moment(entry.user.account.lastLogon).format('YYYY'));

    const yearsOfUsersLastLogons = getYears(userLastLogons);
    const yearsOfEmailsLastLogons = getYears(emailLastLogons);

    return {
      accounts: {
        all: allEntries.length,
        enabled: enabledUsers.length,
        disabled: disabledUsers.length,
        withEmails: emailEntries.length,
        creation: mapEntriesToYears(yearsOfUsersCreation, userCreations),
        lastLogon: mapEntriesToYears(yearsOfUsersLastLogons, userLastLogons)
      },
      emails: {
        allBoxesSize,
        all: emailEntries.length,
        enabled: enabledEmails.length,
        disabled: disabledEmails.length,
        creation: mapEntriesToYears(yearsOfEmailsCreation, emailCreations),
        lastLogon: mapEntriesToYears(yearsOfEmailsLastLogons, emailLastLogons),
      },
    };

  } catch(err) {
    return err.message;
  }
};

module.exports = getEssential;
