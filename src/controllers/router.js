const { Router } = require("express");

const router = new Router();

router.use("/contracts", require("./contracts/controller"));

module.exports = router;
