'use strict';

const fs = require(`fs`);
const {promisify} = require(`util`);
const notify = require(`./service/tg-notifier`);
const {parse} = require(`json2csv`);
const csvToJson = require(`csvtojson`);

const logMessage = async (msg) => {
  console.log(msg);
  await notify(`AD-ENTRIES-BACK: '${msg}'`);
};

const saveToFile = async (path, data) => {
  const writeFile = promisify(fs.writeFile);

  try {
    await writeFile(path, data);
    await logMessage(`Operation success. File '${path}' is created.`);

  } catch (error) {
    await logMessage(`Error: Can't write data to file '${path}'.`);
  }
};

const readFromFile = async (path) => {
  const readFile = promisify(fs.readFile);

  try {
    const result = await readFile(path);
    await logMessage(`Operation success. File '${path}' is read.`);
    return result;

  } catch (error) {
    await logMessage(`Can't read file '${path}'`);
    return error.message;
  }
};

const ldapTimeValueToJsDate = (ldapDate) => new Date(ldapDate / 1e4 - 1.16444736e13);

const ldapYmdToJsDate = (ldapDate) => {
  const b = ldapDate.match(/\d\d/g);
  return new Date(Date.UTC(b[0] + b[1], b[2] - 1, b[3], b[4], b[5], b[6]));
};

const ldapSearch = async (client, settings, searchOptions, adapter) => {
  await client.bind(settings.USERNAME, settings.PASSWORD, [])
    .then(async () => {
      await logMessage(`Successful binding to ${settings.URL} by ${settings.USERNAME}`);
      await logMessage(`Try fetch data by query '${searchOptions.filter}'`);
    })
    .catch(async (err) => await logMessage(`Error: ${err.message}`));

  return await client.search(settings.BASE_DN, searchOptions)
    .then((res) => {
      const entries = [];
      return new Promise((resolve, reject) => {
        res.on(`searchEntry`, (entry) => {
          entries.push(adapter(entry.object));
        });

        res.on(`error`, (error) => reject(error));

        res.on(`end`, async (result) => {
          if (result.status !== 0) {
            return reject(result.status);
          }
          await logMessage(`Entries found: ${entries.length}`);

          return resolve(entries);
        });
      });
    })
    .catch(async (err) => await logMessage(`Error: ${err.message}`));
};

const getCsvFromJson = (jsonData, fields, delimiter = `,`) => {
  const opts = {fields, delimiter};

  try {
    return parse(jsonData, opts);
  } catch (err) {
    console.error(err);
    return err;
  }
};

const getJsonFromCsv = (filename, delimiter = `,`) => {
  return csvToJson({delimiter})
    .fromFile(filename)
    .then((json) => json);
};

module.exports = {saveToFile, readFromFile, ldapTimeValueToJsDate, ldapYmdToJsDate, ldapSearch, logMessage, getCsvFromJson, getJsonFromCsv};
