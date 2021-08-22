'use strict';

const {getCountsByQuotas} = require(`./utils`);
const getUsers = require(`../data/get-users`);

const getQuotas = async () => {
  const {timeStamp, data: allEntries} = await getUsers();
  const emailEntries = allEntries.filter((entry) => entry.user.person.email !== null);

  return {
    timeStamp,
    quotas: getCountsByQuotas(emailEntries, true),
  };
};

module.exports = getQuotas;
