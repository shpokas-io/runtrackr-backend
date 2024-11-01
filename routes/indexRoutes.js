const express = require("express");
const stravaAuth = require("./stravaAuthRoutes");
const api = require("./activityRoutes");

module.exports = {
  stravaAuth,
  api,
};
