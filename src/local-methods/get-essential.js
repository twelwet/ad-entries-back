'use strict';

const moment = require('moment');
const { readFromFile } = require('../utils');
const { reducer, getBoxSize, isDisabled, isEnabled, getYears, mapEntriesToYears } = require('./utils');
const { FileName } = require('../constants');

const getEssential = async () => {
  try {
    const allUsers = JSON.parse(await readFromFile(FileName.USERS));
    const usersWithEmails = allUsers.filter((entry) => entry.user.person.email);

    const allBoxesSize = usersWithEmails
      .filter((entry) => entry.user.person.emailBoxSize)
      .map((entry) => getBoxSize(entry.user.person.emailBoxSize)).reduce(reducer);

    const disabledUsers = allUsers.filter((entry) => isDisabled(entry.user.account.status));
    const enabledUsers = allUsers.filter((entry) => isEnabled(entry.user.account.status));

    const disabledEmails = usersWithEmails.filter((entry) => isDisabled(entry.user.account.status));
    const enabledEmails = usersWithEmails.filter((entry) => isEnabled(entry.user.account.status));

    const userCreations = allUsers.map((entry) => moment(entry.objectInfo.whenCreated).format('YYYY'));
    const emailCreations = usersWithEmails.map((entry) => moment(entry.objectInfo.whenCreated).format('YYYY'));

    const yearsOfUsersCreation = getYears(userCreations);
    const yearsOfEmailsCreation = getYears(emailCreations);

    const userLastLogons = allUsers.map((entry) => entry.user.account.lastLogon === null ? 'never' : moment(entry.user.account.lastLogon).format('YYYY'));
    const emailLastLogons = usersWithEmails.map((entry) => entry.user.account.lastLogon === null ? 'never' : moment(entry.user.account.lastLogon).format('YYYY'));

    const yearsOfUsersLastLogons = getYears(userLastLogons);
    const yearsOfEmailsLastLogons = getYears(emailLastLogons);

    return {
      accounts: {
        all: allUsers.length,
        enabled: enabledUsers.length,
        disabled: disabledUsers.length,
        withEmails: usersWithEmails.length,
        creation: mapEntriesToYears(yearsOfUsersCreation, userCreations),
        lastLogon: mapEntriesToYears(yearsOfUsersLastLogons, userLastLogons)
      },
      emails: {
        allBoxesSize,
        all: usersWithEmails.length,
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
