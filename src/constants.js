'use strict';

const ExitCode = {
  SUCCESS: 0,
  FAILURE: 1
};

const FileName = {
  USERS: 'src/entries/users.json',
  GROUPS: 'src/entries/groups.json',
  OUS: 'src/entries/ous.json',
}

const LdapObject = {
  Type: {
    USER: `objectClass`,
    GROUP: `objectClass`,
    OU: `objectClass`,
  },
  Value: {
    USER: `user`,
    GROUP: `group`,
    OU: `organizationalUnit`,
  },
};

const LdapField = {
  User: {
    NAME: `name`,
    MAIL: `mail`,
  },
};

const UserStatus = {
  ENABLED: [512, 544, 4096, 4128, 66048, 66080, 69632, 528384, 532480],
  DISABLED: [514, 546, 4098, 66050, 66082],
};

const TOP_BOXES = 100;

module.exports = { ExitCode, FileName, LdapObject, LdapField, UserStatus, TOP_BOXES };
