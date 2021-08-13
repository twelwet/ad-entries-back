'use strict';

const { ldapTimeValueToJsDate, ldapYmdToJsDate } = require('../utils');

const getUserAdapter = (userFromService) => {
  const {
    objectClass,
    objectCategory,
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
    mDBOverQuotaLimit,
    userAccountControl,
  } = userFromService;

  return {
    objectInfo: {
      class: objectClass,
      dn,
      category: objectCategory,
      memberOf: typeof memberOf === 'string' ? [memberOf]: memberOf,
      whenCreated: ldapYmdToJsDate(whenCreated),
      whenChanged: ldapYmdToJsDate(whenChanged),
    },
    user: {
      person: {
        displayName,
        email: mail ? mail : null,
        emailBoxSize: drink ? drink : null,
        emailQuota: mDBOverQuotaLimit,
        telephoneNumber: telephoneNumber ? telephoneNumber : null,
        whenEmailCreated: msExchWhenMailboxCreated !== undefined ? ldapYmdToJsDate(msExchWhenMailboxCreated) : null,
      },
      company: { position: title, name: company },
      account: {
        status: userAccountControl,
        name: sAMAccountName,
        fullName: userPrincipalName,
        lastLogon: lastLogon === '0' ? null : ldapTimeValueToJsDate(lastLogon),
        pwdLastSet: ldapTimeValueToJsDate(pwdLastSet),
        logonCount,
      },
    },
  };
};

module.exports = getUserAdapter;
