'use strict';

const express = require(`express`);
const cors = require('cors');
const findAllEntries = require(`./find-methods/find-all-entries`);
const queryEntries = require(`./find-methods/query-entries`);
const getUserAdapter = require(`./adapters/user-adapter`);
const getGroupAdapter = require(`./adapters/group-adapter`);
const getOUAdapter = require(`./adapters/ou-adapter`);
const { LdapObject } = require(`./constants`);

const { Type, Value } = LdapObject;

const app = express();

app.set(`json spaces`, 2);
app.use(express.json());
app.use(cors());

app.get(`/users/all`, async (req, res) => {
  const result = await findAllEntries(Type.USER, Value.USER, getUserAdapter);
  res.json(result);
});

app.get(`/users/:field/:queryValue`, async (req, res) => {
  const field = req.params.field;
  const queryValue = req.params.queryValue;
  const result = await queryEntries(Type.USER, Value.USER, field, queryValue, getUserAdapter);
  res.json(result);
});

app.get(`/groups/all`, async (req, res) => {
  const result = await findAllEntries(Type.GROUP, Value.GROUP, getGroupAdapter);
  res.json(result);
});

app.get(`/groups/:field/:queryValue`, async (req, res) => {
  const field = req.params.field;
  const queryValue = req.params.queryValue;
  const result = await queryEntries(Type.GROUP, Value.GROUP, field, queryValue, getGroupAdapter);
  res.json(result);
});

app.get(`/ous/all`, async (req, res) => {
  const result = await findAllEntries(Type.OU, Value.OU, getOUAdapter);
  res.json(result);
});

app.get(`/ous/:field/:queryValue`, async (req, res) => {
  const field = req.params.field;
  const queryValue = req.params.queryValue;
  const result = await queryEntries(Type.OU, Value.OU, field, queryValue, getOUAdapter);
  res.json(result);
});

app.listen(
    process.env.API_PORT,
  () => console.log(`Server starts on port: ${process.env.API_PORT}`)
);
