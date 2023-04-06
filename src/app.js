const express = require("express");
const bodyParser = require("body-parser");

const { sequelize } = require("./model");

const { getProfile } = require("./middleware/getProfile");

const router = require("./controllers/router");

const app = express();

app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.use(getProfile);

app.use(router);

app.use((error, req, res, next) => {
  if (error.code && error.message) {
    return res.status(error.code).json({
      error: error.message,
    });
  }

  res.status(500).json({
    error: "Internal server error",
  });
});

module.exports = app;
