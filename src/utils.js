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

const ldapTimeValueToJsDate = (ldapDate) => new Date(ldapDate/1e4 - 1.16444736e13);

const ldapYmdToJsDate = (ldapDate) => {
  const b = ldapDate.match(/\d\d/g);
  return new Date(Date.UTC(b[0]+b[1], b[2]-1, b[3], b[4], b[5], b[6]));
};

module.exports = { saveToFile, ldapTimeValueToJsDate, ldapYmdToJsDate };
