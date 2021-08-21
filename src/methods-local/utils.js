'use strict';

const moment = require(`moment`);
const {UserStatus} = require(`../constants`);

const reducer = (accumulator, currentValue) => accumulator + currentValue;

const getBoxSize = (bytes) => {
  if (!bytes) {
    return 0;
  }
  return bytes / 1024 / 1024 / 1024;
};

const isDisabled = (status) => UserStatus.DISABLED.find((item) => item === parseInt(status, 10));
const isEnabled = (status) => UserStatus.ENABLED.find((item) => item === parseInt(status, 10));

const getYears = (entries) => [...(new Set(entries))].sort();

const mapEntriesToYears = (years, entries) => years
  .map((year) => ({[year]: entries
      .filter((entry) => entry === year).length}));

const getDisabledUsers = (users) => users.filter((entry) => isDisabled(entry.user.account.status));
const getEnabledUsers = (users) => users.filter((entry) => isEnabled(entry.user.account.status));

const mapUsersToCreationYears = (users) => users.map((entry) => `year${moment(entry.objectInfo.whenCreated).format(`YYYY`)}`);
const mapUsersToLastLogonYears = (users) => users.map((entry) => entry.user.account.lastLogon === null ? `never` : `year${moment(entry.user.account.lastLogon).format(`YYYY`)}`);

const isBoxLessThan100Mb = (size) => getBoxSize(size) < 0.1;
const isBoxBetween100And500Mb = (size) => getBoxSize(size) >= 0.1 && getBoxSize(size) < 0.5;
const isBoxBetween500And1000Mb = (size) => getBoxSize(size) > 0.5 && getBoxSize(size) < 1;
const isBoxBetween1And5Gb = (size) => getBoxSize(size) >= 1 && getBoxSize(size) < 5;
const isBoxBetween5And10Gb = (size) => getBoxSize(size) >= 5 && getBoxSize(size) < 10;

const getCountsByBoxSizes = (entriesWithEmail) => {
  let countLess100Mb = 0;
  let countBetween100And500Mb = 0;
  let countBetween500And1000Mb = 0;
  let countBetween1And5Gb = 0;
  let countBetween5And10Gb = 0;
  let countMoreThan10Gb = 0;
  for (const entry of entriesWithEmail) {
    if (isBoxLessThan100Mb(entry.user.person.emailBoxSize)) {
      countLess100Mb++;
    } else if (isBoxBetween100And500Mb(entry.user.person.emailBoxSize)) {
      countBetween100And500Mb++;
    } else if (isBoxBetween500And1000Mb(entry.user.person.emailBoxSize)) {
      countBetween500And1000Mb++;
    } else if (isBoxBetween1And5Gb(entry.user.person.emailBoxSize)) {
      countBetween1And5Gb++;
    } else if (isBoxBetween5And10Gb(entry.user.person.emailBoxSize)) {
      countBetween5And10Gb++;
    } else {
      countMoreThan10Gb++;
    }
  }
  return [
    countLess100Mb,
    countBetween100And500Mb,
    countBetween500And1000Mb,
    countBetween1And5Gb,
    countBetween5And10Gb,
    countMoreThan10Gb,
  ];
};

module.exports = {
  reducer,
  getBoxSize,
  isDisabled,
  isEnabled,
  getYears,
  mapEntriesToYears,
  getDisabledUsers,
  getEnabledUsers,
  mapUsersToCreationYears,
  mapUsersToLastLogonYears,
  getCountsByBoxSizes,
};
