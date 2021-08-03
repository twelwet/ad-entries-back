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
      email: mail,
      telephoneNumber,
      whenEmailCreated: msExchWhenMailboxCreated === '0' ? undefined : ldapTimeValueToJsDate(msExchWhenMailboxCreated),
    },
    company: {
      position: title,
      name: company,
    },
    account: {
      name: sAMAccountName,
      fullName: userPrincipalName,
      lastLogon: lastLogon === '0' ? undefined : ldapTimeValueToJsDate(lastLogon),
      whenCreated: ldapYmdToJsDate(whenCreated),
      whenChanged: ldapYmdToJsDate(whenChanged),
      pwdLastSet: ldapTimeValueToJsDate(pwdLastSet),
      logonCount,
    },
  };
};

module.exports = getUserAdapter;
