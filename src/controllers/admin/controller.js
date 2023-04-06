const ValidationException = require("../../exceptions/validation");

const { AdminService } = require("./service");

const { Router } = require("express");

const router = new Router();

const service = new AdminService();

router.get("/best-profession", async (req, res, next) => {
  const { start, end } = req.query;
  try {
    if (!start) {
      throw new ValidationException("Start date is required");
    }

    if (!end) {
      throw new ValidationException("End date is required");
    }

    const result = await service.getBestProfession(start, end);

    return res.json(result);
  } catch (e) {
    return next(e);
  }
});

router.get("/best-clients", async (req, res, next) => {
  const { start, end } = req.query;
  const limit = req.query.limit || 2;

  try {
    if (!start) {
      throw new ValidationException("Start date is required");
    }

    if (!end) {
      throw new ValidationException("End date is required");
    }

    const clients = await service.getBestClients(start, end, limit);

    return res.json(clients);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
