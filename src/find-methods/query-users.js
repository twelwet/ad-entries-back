'use strict';

const {client, Settings} = require(`../service/service`);
const { LdapObject } = require(`../constants`);

const { Type, Value } = LdapObject;

const queryUsers = async (field, queryValue, adapter = (...params) => params) => {
  const searchOptions = {
    scope: 'sub',
    filter: `(&(${Type.USER}=${Value.USER})(${field}=*${queryValue}*))`,
  };
  await client.bind(Settings.USERNAME, Settings.PASSWORD, [])
    .then(() => console.log(`Successful binding to ${Settings.URL} by ${Settings.USERNAME}`))
    .catch((err) => console.log(`Error: ${err.message}`));

  return await client.search(Settings.BASE_DN, searchOptions)
    .then((res) => {
      const entries = [];
      return new Promise((resolve, reject) => {
        res.on(`searchEntry`, (entry) => {
          entries.push(adapter(entry.object));
        });

        res.on(`error`, (error) => reject(error));

        res.on('end', async (result) => {
          if (result.status !== 0) {
            return reject(result.status);
          }
          console.log(`Entries found: ${entries.length}`);

          await client.unbind()
            .then(() => console.log(`Successful unbinding`))
            .catch((err) => console.log(`Error: ${err.message}`));

          return resolve(entries);
        });
      });
    })
    .catch((err) => console.log(`Error: ${err.message}`));
};

module.exports = queryUsers;
