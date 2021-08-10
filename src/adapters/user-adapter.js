'use strict';

const { ldapTimeValueToJsDate, ldapYmdToJsDate } = require('../utils');

const getUserAdapter = (userFromService) => {
  const {
    objectClass,
    dn,
    displayName,
    title,
    telephoneNumber,
    company,
    lastLogon,
    whenCreated,
    whenChanged,
    pwdLastSet,
    msExchWhenMailboxCreated,
    logonCount,
    userPrincipalName,
    sAMAccountName,
    mail,
    memberOf,
    drink,
  } = userFromService;

  return {
    objectInfo: {
      class: objectClass,
      dn,
      memberOf,
    },
    person: {
      displayName,
      email: mail ? mail : null,
      emailBoxSize: drink ? drink : null,
      telephoneNumber: telephoneNumber ? telephoneNumber : null,
      whenEmailCreated: msExchWhenMailboxCreated !== undefined ? ldapYmdToJsDate(msExchWhenMailboxCreated) : null,
    },
    company: {
      position: title,
      name: company,
    },
    account: {
      name: sAMAccountName,
      fullName: userPrincipalName,
      lastLogon: lastLogon === '0' ? null : ldapTimeValueToJsDate(lastLogon),
      whenCreated: ldapYmdToJsDate(whenCreated),
      whenChanged: ldapYmdToJsDate(whenChanged),
      pwdLastSet: ldapTimeValueToJsDate(pwdLastSet),
      logonCount,
    },
  };
};

module.exports = getUserAdapter;
