'use strict';

const { readFromFile } = require('../utils');
const { FileName, UserStatus } = require('../constants');

const reducer = (accumulator, currentValue) => accumulator + currentValue;
const getBoxSize = (bytes) => bytes / 1024 / 1024 / 1024;
const isDisabled = (status) => UserStatus.DISABLED.find((item) => item === parseInt(status, 10));
const isEnabled = (status) => UserStatus.ENABLED.find((item) => item === parseInt(status, 10));

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

    return {
      accounts: {
        all: allUsers.length,
        enabled: enabledUsers.length,
        disabled: disabledUsers.length,
        withEmails: usersWithEmails.length,
      },
      emails: {
        all: usersWithEmails.length,
        enabled: enabledEmails.length,
        disabled: disabledEmails.length,
      },
      allBoxesSize
    };

  } catch(err) {
    return err.message;
  }
};

module.exports = getEssential;
