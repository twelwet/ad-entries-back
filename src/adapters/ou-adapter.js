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
    l,
    st,
    street,
  } = oUFromService;

  return {
    objectClass,
    objectCategory,
    dn,
    title: ou,
    description,
    location: {
      region: st,
      city: l,
      street,
    },
    whenCreated: ldapYmdToJsDate(whenCreated),
    whenChanged: ldapYmdToJsDate(whenChanged),
  };
};

module.exports = getOUAdapter;
