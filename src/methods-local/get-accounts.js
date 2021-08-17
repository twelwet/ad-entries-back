'use strict';

const {
  getDisabledUsers,
  getEnabledUsers,
  mapUsersToCreationYears,
  mapUsersToLastLogonYears,
  getYears,
  mapEntriesToYears,
} = require(`./utils`);
const getUsers = require(`../data/get-users`);

const getAccounts = async () => {
  try {
    const {timeStamp, data: allEntries} = await getUsers();
    const emailEntries = allEntries.filter((entry) => entry.user.person.email);

    const userCreations = mapUsersToCreationYears(allEntries);
    const yearsOfUsersCreation = getYears(userCreations);

    const userLastLogons = mapUsersToLastLogonYears(allEntries);
    const yearsOfUsersLastLogons = getYears(userLastLogons);

    return {
      timeStamp,
      count: {
        all: allEntries.length,
        enabled: getEnabledUsers(allEntries).length,
        disabled: getDisabledUsers(allEntries).length,
        withEmails: emailEntries.length,
      },
      creation: mapEntriesToYears(yearsOfUsersCreation, userCreations),
      lastLogon: mapEntriesToYears(yearsOfUsersLastLogons, userLastLogons)
    };

  } catch (err) {
    return err.message;
  }
};

module.exports = getAccounts;
