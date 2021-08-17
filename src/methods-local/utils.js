'use strict';

const moment = require(`moment`);
const {UserStatus} = require(`../constants`);

const reducer = (accumulator, currentValue) => accumulator + currentValue;
const getBoxSize = (bytes) => bytes / 1024 / 1024 / 1024;

const isDisabled = (status) => UserStatus.DISABLED.find((item) => item === parseInt(status, 10));
const isEnabled = (status) => UserStatus.ENABLED.find((item) => item === parseInt(status, 10));

const getYears = (entries) => [...(new Set(entries))].sort();

const mapEntriesToYears = (years, entries) => years
  .map((year) => ({[year]: entries
      .filter((entry) => entry === year).length}));

const getDisabledUsers = (users) => users.filter((entry) => isDisabled(entry.user.account.status));
const getEnabledUsers = (users)  => users.filter((entry) => isEnabled(entry.user.account.status));

const mapUsersToCreationYears = (users) => users.map((entry) => `year${moment(entry.objectInfo.whenCreated).format(`YYYY`)}`);
const mapUsersToLastLogonYears = (users) => users.map((entry) => entry.user.account.lastLogon === null ? `never` : `year${moment(entry.user.account.lastLogon).format(`YYYY`)}`);

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
};
