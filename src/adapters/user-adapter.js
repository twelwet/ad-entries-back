'use strict';

const { ldapTimeValueToJsDate, ldapYmdToJsDate } = require('../utils');

const getUserAdapter = (userFromService) => {
  const {
    objectClass,
    dn,
    cn,
    sn,
    title,
    telephoneNumber,
    company,
    givenName,
    lastLogon,
    whenCreated,
    whenChanged,
    pwdLastSet,
    msExchWhenMailboxCreated,
    logonCount,
    userPrincipalName,
    sAMAccountName,
    mail,
  } = userFromService;

  return {
    objectInfo: {
      class: objectClass,
      dn,
    },
    person: {
      name: givenName,
      surname: sn,
      fullName: cn,
      email: mail ? mail : null,
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
