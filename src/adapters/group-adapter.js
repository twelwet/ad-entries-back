'use strict';

const { ldapYmdToJsDate } = require('../utils');

const getGroupAdapter = (groupFromService) => {
  const {
    objectClass,
    objectCategory,
    dn,
    cn,
    description,
    memberOf,
    whenCreated,
    whenChanged,
  } = groupFromService;

  return {
    objectClass,
    objectCategory,
    dn,
    title: cn,
    description,
    memberOf,
    whenCreated: ldapYmdToJsDate(whenCreated),
    whenChanged: ldapYmdToJsDate(whenChanged),
  };
};

module.exports = getGroupAdapter;
