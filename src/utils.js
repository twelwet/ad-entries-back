'use strict';

const fs = require(`fs`);
const {promisify} = require(`util`);

const saveToFile = async (path, data) => {
  const writeFile = promisify(fs.writeFile);

  try {
    await writeFile(path, data);
    console.log(`Operation success. File '${path}' created.`);

  } catch (error) {
    console.error(`Can't write data to file...`);
  }
};

const readFromFile = async (path) => {
  const readFile = promisify(fs.readFile);

  try {
    const result = await readFile(path);
    console.log(`Operation success. File '${path}' is read.`);
    return result;

  } catch (error) {
    console.error(`Can't read file '${path}'`);
  }
};

const ldapTimeValueToJsDate = (ldapDate) => new Date(ldapDate/1e4 - 1.16444736e13);

const ldapYmdToJsDate = (ldapDate) => {
  const b = ldapDate.match(/\d\d/g);
  return new Date(Date.UTC(b[0]+b[1], b[2]-1, b[3], b[4], b[5], b[6]));
};

const ldapSearch = async (client, settings, searchOptions, adapter) => {
  await client.bind(settings.USERNAME, settings.PASSWORD, [])
    .then(() => {
      console.log(`Successful binding to ${settings.URL} by ${settings.USERNAME}`);
      console.log(`Try fetch data by query '${searchOptions.filter}'`);
    })
    .catch((err) => console.log(`Error: ${err.message}`));

  return await client.search(settings.BASE_DN, searchOptions)
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

          return resolve(entries);
        });
      });
    })
    .catch((err) => console.log(`Error: ${err.message}`));
}

module.exports = { saveToFile, readFromFile, ldapTimeValueToJsDate, ldapYmdToJsDate, ldapSearch };
