'use strict';

const {
  reducer,
  getBoxSize,
  getDisabledUsers,
  getEnabledUsers,
  mapUsersToCreationYears,
  mapUsersToLastLogonYears,
  getYears,
  mapEntriesToYears,
} = require(`./utils`);
const {TOP_BOXES} = require(`../constants`);
const getUsers = require(`../data/get-users`);

const getEmails = async () => {
  try {
    const {timeStamp, data: allEntries} = await getUsers();
    const emailEntries = allEntries.filter((entry) => entry.user.person.email);

    const topBoxes = emailEntries
      .sort((a, b) => b.user.person.emailBoxSize - a.user.person.emailBoxSize)
      .slice(0, TOP_BOXES);

    const allBoxesSize = emailEntries
      .filter((entry) => entry.user.person.emailBoxSize)
      .map((entry) => getBoxSize(entry.user.person.emailBoxSize)).reduce(reducer);

    const emailCreations = mapUsersToCreationYears(emailEntries);
    const yearsOfEmailsCreation = getYears(emailCreations);

    const emailLastLogons = mapUsersToLastLogonYears(emailEntries);
    const yearsOfEmailsLastLogons = getYears(emailLastLogons);

    return {
      timeStamp,
      count: {
        all: emailEntries.length,
        enabled: getEnabledUsers(emailEntries).length,
        disabled: getDisabledUsers(emailEntries).length,
        allBoxesSize: allBoxesSize.toFixed(2),
      },
      creation: mapEntriesToYears(yearsOfEmailsCreation, emailCreations),
      lastLogon: mapEntriesToYears(yearsOfEmailsLastLogons, emailLastLogons),
      topBoxes,
    };

  } catch (err) {
    return err.message;
  }
};

module.exports = getEmails;
