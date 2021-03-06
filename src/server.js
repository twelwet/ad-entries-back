'use strict';

const express = require(`express`);
const cors = require(`cors`);
const downLoadAllEntries = require(`./methods-remote/download-all-entries`);
const queryEntries = require(`./methods-remote/query-entries`);
const getUserAdapter = require(`./adapters/user-adapter`);
const getGroupAdapter = require(`./adapters/group-adapter`);
const getOUAdapter = require(`./adapters/ou-adapter`);
const {LdapObject, FileName} = require(`./constants`);
const getAccounts = require(`./methods-local/get-accounts`);
const getQuotas = require(`./methods-local/get-quotas`);
const getEmails = require(`./methods-local/get-emails`);
const {logMessage} = require(`./utils`);

const {Type, Value} = LdapObject;

const app = express();

app.set(`json spaces`, 2);
app.use(express.json());
app.use(cors());

app.get(`/users/all`, async (req, res) => {
  try {
    const result = await downLoadAllEntries(Type.USER, Value.USER, getUserAdapter, FileName.USERS);
    res.json(result);
    await logMessage(`${req.method} ${decodeURI(req.originalUrl)} -> response: '${res.statusCode}'`);
  } catch (error) {
    res.json([]);
    await logMessage(`Error occurs: ${error}`);
  }
});

app.get(`/users/:field/:queryValue`, async (req, res) => {
  try {
    const field = req.params.field;
    const queryValue = req.params.queryValue;
    const result = await queryEntries(Type.USER, Value.USER, field, queryValue, getUserAdapter);
    res.json(result);
    await logMessage(`${req.method} ${decodeURI(req.originalUrl)} -> response: '${res.statusCode}'`);
  } catch (error) {
    res.json([]);
    await logMessage(`Error occurs: ${error}`);
  }
});

app.get(`/accounts`, async (req, res) => {
  try {
    res.json(await getAccounts());
    await logMessage(`${req.method} ${decodeURI(req.originalUrl)} -> response: '${res.statusCode}'`);
  } catch (error) {
    res.json({});
    await logMessage(`Error occurs: ${error}`);
  }
});

app.get(`/emails`, async (req, res) => {
  try {
    res.json(await getEmails());
    await logMessage(`${req.method} ${decodeURI(req.originalUrl)} -> response: '${res.statusCode}'`);
  } catch (error) {
    res.json({});
    await logMessage(`Error occurs: ${error}`);
  }
});

app.get(`/groups/all`, async (req, res) => {
  try {
    const result = await downLoadAllEntries(Type.GROUP, Value.GROUP, getGroupAdapter, FileName.GROUPS);
    res.json(result);
    await logMessage(`${req.method} ${decodeURI(req.originalUrl)} -> response: '${res.statusCode}'`);
  } catch (error) {
    res.json([]);
    await logMessage(`Error occurs: ${error}`);
  }
});

app.get(`/groups/:field/:queryValue`, async (req, res) => {
  try {
    const field = req.params.field;
    const queryValue = req.params.queryValue;
    const result = await queryEntries(Type.GROUP, Value.GROUP, field, queryValue, getGroupAdapter);
    res.json(result);
    await logMessage(`${req.method} ${decodeURI(req.originalUrl)} -> response: '${res.statusCode}'`);
  } catch (error) {
    res.json([]);
    await logMessage(`Error occurs: ${error}`);
  }
});

app.get(`/ous/all`, async (req, res) => {
  try {
    const result = await downLoadAllEntries(Type.OU, Value.OU, getOUAdapter, FileName.OUS);
    res.json(result);
    await logMessage(`${req.method} ${decodeURI(req.originalUrl)} -> response: '${res.statusCode}'`);
  } catch (error) {
    res.json([]);
    await logMessage(`Error occurs: ${error}`);
  }
});

app.get(`/ous/:field/:queryValue`, async (req, res) => {
  try {
    const field = req.params.field;
    const queryValue = req.params.queryValue;
    const result = await queryEntries(Type.OU, Value.OU, field, queryValue, getOUAdapter);
    res.json(result);
    await logMessage(`${req.method} ${decodeURI(req.originalUrl)} -> response: '${res.statusCode}'`);
  } catch (error) {
    res.json([]);
    await logMessage(`Error occurs: ${error}`);
  }
});

app.get(`/quotas`, async (req, res) => {
  try {
    res.json(await getQuotas());
    await logMessage(`${req.method} ${decodeURI(req.originalUrl)} -> response: '${res.statusCode}'`);
  } catch (error) {
    res.json([]);
    await logMessage(`Error occurs: ${error}`);
  }
});

app.listen(
    process.env.API_PORT,
    () => console.log(`Server starts on port: ${process.env.API_PORT}`)
);
