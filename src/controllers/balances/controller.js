const { BalanceService } = require("./service");

const { Router } = require("express");

const router = new Router();

const service = new BalanceService();

router.post("/deposit/:userId", async (req, res, next) => {
  const { userId } = req.params;
  const { amount } = req.body;

  try {
    const client = await service.deposit(userId, amount);
    return res.json(client);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
