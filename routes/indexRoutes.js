const express = require("express");
const stravaAuth = require("./stravaAuthRoutes");
const api = require("./activityRoutes.js");

module.exports = {
  stravaAuth,
  api,
};
