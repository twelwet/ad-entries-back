'use strict';

const express = require(`express`);
const findAllEntries = require(`./find-methods/find-all-entries`);
const queryUsers = require(`./find-methods/query-users`);
const getUserAdapter = require(`./adapters/user-adapter`);
const getGroupAdapter = require(`./adapters/group-adapter`);
const getOUAdapter = require(`./adapters/ou-adapter`);
const { LdapObject } = require(`./constants`);

const { Type, Value } = LdapObject;

const app = express();

app.set(`json spaces`, 2);
app.use(express.json());

app.get(`/users`, async (req, res) => {
  const result = await findAllEntries(Type.USER, Value.USER, getUserAdapter);
  res.json(result);
});

app.get(`/users/:field/:queryValue`, async (req, res) => {
  const field = req.params.field;
  const queryValue = req.params.queryValue;
  const result = await queryUsers(field, queryValue, getUserAdapter);
  res.json(result);
});

app.get(`/groups`, async (req, res) => {
  const result = await findAllEntries(Type.GROUP, Value.GROUP, getGroupAdapter);
  res.json(result);
});

app.get(`/ous`, async (req, res) => {
  const result = await findAllEntries(Type.OU, Value.OU, getOUAdapter);
  res.json(result);
});


app.listen(
    process.env.API_PORT,
  () => console.log(`Server starts on port: ${process.env.API_PORT}`)
);
