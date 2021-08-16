'use strict';

const {UserStatus} = require(`../constants`);

const reducer = (accumulator, currentValue) => accumulator + currentValue;
const getBoxSize = (bytes) => bytes / 1024 / 1024 / 1024;

const isDisabled = (status) => UserStatus.DISABLED.find((item) => item === parseInt(status, 10));
const isEnabled = (status) => UserStatus.ENABLED.find((item) => item === parseInt(status, 10));

const getYears = (entries) => [...(new Set(entries))].sort();

const mapEntriesToYears = (years, entries) => years
  .map((year) => ({[year]: entries
      .filter((entry) => entry === year).length}));

module.exports = {reducer, getBoxSize, isDisabled, isEnabled, getYears, mapEntriesToYears};
