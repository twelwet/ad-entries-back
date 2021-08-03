'use strict';

const ExitCode = {
  SUCCESS: 0,
  FAILURE: 1
};

const FILE_NAME = `entries.json`;

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

module.exports = { ExitCode, FILE_NAME, LdapObject, LdapField };
