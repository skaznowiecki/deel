const { Router } = require("express");

const router = new Router();

router.use("/contracts", require("./contracts/controller"));
router.use("/jobs", require("./jobs/controller"));
router.use("/balances", require("./balances/controller"));

module.exports = router;
