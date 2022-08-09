'use strict';

const getUsers = require(`../data/get-users`);
const {saveToFile, getCsvFromJson} = require(`../utils`);

const FIELDS = [
  `name`,
  `position`,
  `company`,
  `email`,
  `size`,
  `quota`,
  `lastLogon`,
];

getUsers().then((users) => {
  const {data} = users;
  const emailEntries = data.filter((entry) => entry.user.person.email !== null);

  const result = emailEntries.map((item) => ({
    name: item[`user`][`person`][`displayName`],
    position: item[`company`][`position`],
    company: item[`company`][`name`],
    email: item[`user`][`person`][`email`],
    size: item[`user`][`person`][`emailBoxSize`],
    quota: item[`user`][`person`][`emailQuota`],
    lastLogon: item[`account`][`lastLogon`],
  }));

  saveToFile(`src/download/emails.csv`, getCsvFromJson(result, FIELDS))
    .then(() => console.log(`Operation is successful.`));
});
