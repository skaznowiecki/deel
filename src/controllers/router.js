const { Router } = require("express");

const { getProfile } = require("../middleware/getProfile");

const router = new Router();

router.use("/contracts", getProfile, require("./contracts/controller"));
router.use("/jobs", getProfile, require("./jobs/controller"));
router.use("/balances", require("./balances/controller"));
router.use("/admin", require("./admin/controller"));

module.exports = router;
