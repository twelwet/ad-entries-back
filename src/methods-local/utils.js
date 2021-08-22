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
  const count = {
    lessThan100Mb: {boxesCount: 0, quotasCount: 0, summaryBoxSize: 0},
    between100And500Mb: {boxesCount: 0, quotasCount: 0, summaryBoxSize: 0},
    between500And1000Mb: {boxesCount: 0, quotasCount: 0, summaryBoxSize: 0},
    between1And5Gb: {boxesCount: 0, quotasCount: 0, summaryBoxSize: 0},
    between5And10Gb: {boxesCount: 0, quotasCount: 0, summaryBoxSize: 0},
    moreThan10Gb: {boxesCount: 0, quotasCount: 0, summaryBoxSize: 0},
  };

  const {lessThan100Mb, between100And500Mb, between500And1000Mb, between1And5Gb, between5And10Gb, moreThan10Gb} = count;

  for (const entry of entriesWithEmail) {
    const boxSize = parseInt(entry.user.person.emailBoxSize, 10);
    const quotaSize = parseInt(entry.user.person.emailQuota, 10);

    if (isBoxLessThan100Mb(entry.user.person.emailBoxSize)) {
      lessThan100Mb.boxesCount++;
      boxSize > 0 ? lessThan100Mb.summaryBoxSize = lessThan100Mb.summaryBoxSize + boxSize : null;
      quotaSize > 0 ? lessThan100Mb.quotasCount++ : null;

    } else if (isBoxBetween100And500Mb(entry.user.person.emailBoxSize)) {
      between100And500Mb.boxesCount++;
      boxSize > 0 ? between100And500Mb.summaryBoxSize = between100And500Mb.summaryBoxSize + boxSize : null;
      quotaSize > 0 ? between100And500Mb.quotasCount++ : null;

    } else if (isBoxBetween500And1000Mb(entry.user.person.emailBoxSize)) {
      between500And1000Mb.boxesCount++;
      boxSize > 0 ? between500And1000Mb.summaryBoxSize = between500And1000Mb.summaryBoxSize + boxSize : null;
      quotaSize > 0 ? between500And1000Mb.quotasCount++ : null;

    } else if (isBoxBetween1And5Gb(entry.user.person.emailBoxSize)) {
      between1And5Gb.boxesCount++;
      boxSize > 0 ? between1And5Gb.summaryBoxSize = between1And5Gb.summaryBoxSize + boxSize : null;
      quotaSize > 0 ? between1And5Gb.quotasCount++ : null;

    } else if (isBoxBetween5And10Gb(entry.user.person.emailBoxSize)) {
      between5And10Gb.boxesCount++;
      boxSize > 0 ? between5And10Gb.summaryBoxSize = between5And10Gb.summaryBoxSize + boxSize : null;
      quotaSize > 0 ? between5And10Gb.quotasCount++ : null;

    } else {
      moreThan10Gb.boxesCount++;
      boxSize > 0 ? moreThan10Gb.summaryBoxSize = moreThan10Gb.summaryBoxSize + boxSize : null;
      quotaSize > 0 ? moreThan10Gb.quotasCount++ : null;
    }
  }

  return [
    {
      name: `Less than 100Mb`,
      count: count.lessThan100Mb.boxesCount,
      quotas: count.lessThan100Mb.quotasCount,
      summarySize: getBoxSize(count.lessThan100Mb.summaryBoxSize),
    },
    {
      name: `Between 100Mb and 500Mb`,
      count: count.between100And500Mb.boxesCount,
      quotas: count.between100And500Mb.quotasCount,
      summarySize: getBoxSize(count.between100And500Mb.summaryBoxSize),
    },
    {
      name: `Between 500Mb and 1Gb`,
      count: count.between500And1000Mb.boxesCount,
      quotas: count.between500And1000Mb.quotasCount,
      summarySize: getBoxSize(count.between500And1000Mb.summaryBoxSize),
    },
    {
      name: `Between 1Gb and 5Gb`,
      count: count.between1And5Gb.boxesCount,
      quotas: count.between1And5Gb.quotasCount,
      summarySize: getBoxSize(count.between1And5Gb.summaryBoxSize),
    },
    {
      name: `Between 5Gb and 10Gb`,
      count: count.between5And10Gb.boxesCount,
      quotas: count.between5And10Gb.quotasCount,
      summarySize: getBoxSize(count.between5And10Gb.summaryBoxSize),
    },
    {
      name: `More than 10Gb`,
      count: count.moreThan10Gb.boxesCount,
      quotas: count.moreThan10Gb.quotasCount,
      summarySize: getBoxSize(count.moreThan10Gb.summaryBoxSize),
    },
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
