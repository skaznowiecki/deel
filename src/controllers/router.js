const { Router } = require("express");

const { getProfile } = require("../middleware/getProfile");

const router = new Router();

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "DEEL REST API",
      version: "1.0.0",
    },
  },
  apis: ["./**/swagger.yml", "./swagger.yml"],
};

const swaggerSpec = swaggerJSDoc(options);

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.use("/contracts", getProfile, require("./contracts/controller"));
router.use("/jobs", getProfile, require("./jobs/controller"));
router.use("/balances", require("./balances/controller"));
router.use("/admin", require("./admin/controller"));

module.exports = router;
