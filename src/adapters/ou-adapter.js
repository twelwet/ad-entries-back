'use strict';

const { ldapYmdToJsDate } = require('../utils');

const getOUAdapter = (oUFromService) => {
  const {
    objectClass,
    objectCategory,
    dn,
    ou,
    description,
    whenCreated,
    whenChanged,
    memberOf,
    l,
    st,
    street,
  } = oUFromService;

  return {
    objectInfo: {
      class: objectClass,
      dn,
      category: objectCategory,
      memberOf: typeof memberOf === 'string' ? [memberOf]: memberOf,
      whenCreated: ldapYmdToJsDate(whenCreated),
      whenChanged: ldapYmdToJsDate(whenChanged),
    },
    ou: {
      title: ou,
      description,
      location: { region: st, city: l, street },
    },
  };
};

module.exports = getOUAdapter;
