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

const getQuotedUsers = (users) => users.filter((entry) => entry.user.person.emailQuota);
const getNotQuotedUsers = (users) => users.filter((entry) => !entry.user.person.emailQuota);

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

  let quotasLessThan100Mb = 0;
  let quotasBetween100And500Mb = 0;
  let quotasBetween500And1000Mb = 0;
  let quotasBetween1And5Gb = 0;
  let quotasBetween5And10Gb = 0;
  let quotasMoreThan10Gb = 0;

  for (const entry of entriesWithEmail) {
    if (isBoxLessThan100Mb(entry.user.person.emailBoxSize)) {
      countLess100Mb++;
      if (parseInt(entry.user.person.emailQuota, 10) > 0) {
        quotasLessThan100Mb++;
      }
    } else if (isBoxBetween100And500Mb(entry.user.person.emailBoxSize)) {
      countBetween100And500Mb++;
      if (parseInt(entry.user.person.emailQuota, 10) > 0) {
        quotasBetween100And500Mb++;
      }
    } else if (isBoxBetween500And1000Mb(entry.user.person.emailBoxSize)) {
      countBetween500And1000Mb++;
      if (parseInt(entry.user.person.emailQuota, 10) > 0) {
        quotasBetween500And1000Mb++;
      }
    } else if (isBoxBetween1And5Gb(entry.user.person.emailBoxSize)) {
      countBetween1And5Gb++;
      if (parseInt(entry.user.person.emailQuota, 10) > 0) {
        quotasBetween1And5Gb++;
      }
    } else if (isBoxBetween5And10Gb(entry.user.person.emailBoxSize)) {
      countBetween5And10Gb++;
      if (parseInt(entry.user.person.emailQuota, 10) > 0) {
        quotasBetween5And10Gb++;
      }
    } else {
      countMoreThan10Gb++;
      if (parseInt(entry.user.person.emailQuota, 10) > 0) {
        quotasMoreThan10Gb++;
      }
    }
  }

  return [
    {name: `Less than 100Mb`, count: countLess100Mb, quotas: quotasLessThan100Mb},
    {name: `Between 100Mb and 500Mb`, count: countBetween100And500Mb, quotas: quotasBetween100And500Mb},
    {name: `Between 500Mb and 1Gb`, count: countBetween500And1000Mb, quotas: quotasBetween500And1000Mb},
    {name: `Between 1Gb and 5Gb`, count: countBetween1And5Gb, quotas: quotasBetween1And5Gb},
    {name: `Between 5Gb and 10Gb`, count: countBetween5And10Gb, quotas: quotasBetween5And10Gb},
    {name: `More than 10Gb`, count: countMoreThan10Gb, quotas: quotasMoreThan10Gb},
  ];
};

const getQuotesList = (entriesWithEmail) => [...(new Set(entriesWithEmail
  .filter((entry) => entry.user.person.emailQuota)
  .map((entry) => parseInt(entry.user.person.emailQuota, 10))))].sort((a, b) => a - b);

const getCountsByQuotas = (entriesWithEmail, extended = false) => getQuotesList(entriesWithEmail)
  .map((item) => {
    const entriesQuotaList = entriesWithEmail.filter((entry) => entry.user.person.emailQuota === item.toString());
    if (extended) {
      return {
        megabytes: item / 1024,
        count: entriesQuotaList.length,
        accounts: entriesQuotaList
          .sort((a, b) => b.user.person.emailBoxSize - a.user.person.emailBoxSize)
          .map((entry) => ({
            email: entry.user.person.email,
            size: `${(entry.user.person.emailBoxSize / 1024 / 1024).toFixed(2)} megabytes`,
          }))
      };
    }
    return {
      megabytes: item / 1024,
      count: entriesQuotaList.length,
    };
  });

module.exports = {
  reducer,
  getBoxSize,
  isDisabled,
  isEnabled,
  getYears,
  mapEntriesToYears,
  getDisabledUsers,
  getEnabledUsers,
  getQuotedUsers,
  getNotQuotedUsers,
  mapUsersToCreationYears,
  mapUsersToLastLogonYears,
  getCountsByBoxSizes,
  getCountsByQuotas,
};
