const { Router } = require("express");

const router = new Router();

router.use("/contracts", require("./contracts/controller"));
router.use("/jobs", require("./jobs/controller"));

module.exports = router;
