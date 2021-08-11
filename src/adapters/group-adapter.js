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
    member,
  } = groupFromService;

  return {
    objectInfo: {
      class: objectClass,
      dn,
      category: objectCategory,
      memberOf: typeof memberOf === 'string' ? [memberOf]: memberOf,
      whenCreated: ldapYmdToJsDate(whenCreated),
      whenChanged: ldapYmdToJsDate(whenChanged),
    },
    group: {
      title: cn,
      description,
      member: typeof member === 'string' ? [member]: member,
    }
  };
};

module.exports = getGroupAdapter;
