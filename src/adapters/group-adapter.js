'use strict';

const { ldapYmdToJsDate } = require('../utils');

const getMember = (member) => {
  if (!member) {
    return [];
  }
  if (typeof member === 'string') {
    return [member];
  }
  return member;
}

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
      member: getMember(member),
    }
  };
};

module.exports = getGroupAdapter;
