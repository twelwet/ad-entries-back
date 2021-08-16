'use strict';

const moment = require('moment');
const { readFromFile } = require('../utils');
const { reducer, getBoxSize, isDisabled, isEnabled, getYears, mapEntriesToYears } = require('./utils');
const { FileName, TOP_BOXES } = require('../constants');

const getAccounts = async () => {
  try {
    const allEntries = JSON.parse(await readFromFile(FileName.USERS));
    const emailEntries = allEntries.filter((entry) => entry.user.person.email);

    const topBoxes = emailEntries
      .sort((a, b) => b.user.person.emailBoxSize - a.user.person.emailBoxSize)
      .slice(0, TOP_BOXES);

    const allBoxesSize = emailEntries
      .filter((entry) => entry.user.person.emailBoxSize)
      .map((entry) => getBoxSize(entry.user.person.emailBoxSize)).reduce(reducer);

    const disabledEmails = emailEntries.filter((entry) => isDisabled(entry.user.account.status));
    const enabledEmails = emailEntries.filter((entry) => isEnabled(entry.user.account.status));

    const emailCreations = emailEntries.map((entry) => `year${moment(entry.objectInfo.whenCreated).format('YYYY')}`);

    const yearsOfEmailsCreation = getYears(emailCreations);

    const emailLastLogons = emailEntries.map((entry) => entry.user.account.lastLogon === null ? 'never' : `year${moment(entry.user.account.lastLogon).format('YYYY')}`);

    const yearsOfEmailsLastLogons = getYears(emailLastLogons);

    return {
      count: {
        all: emailEntries.length,
        enabled: enabledEmails.length,
        disabled: disabledEmails.length,
        allBoxesSize: allBoxesSize.toFixed(2),
      },
      creation: mapEntriesToYears(yearsOfEmailsCreation, emailCreations),
      lastLogon: mapEntriesToYears(yearsOfEmailsLastLogons, emailLastLogons),
      topBoxes,
    };

  } catch(err) {
    return err.message;
  }
};

module.exports = getAccounts;
