const { Router } = require("express");

const EntityNotFoundException = require("../../exceptions/entityNotFound");

const router = new Router();

const { ContractService } = require("./service");

const service = new ContractService();

router.get("/", async (req, res) => {
  const { profile } = req;
  const contracts = await service.list(profile);
  return res.json(contracts);
});

router.get("/:id", async (req, res, next) => {
  try {
    const { profile } = req;
    const { id } = req.params;

    const contract = await service.get(profile, id);

    if (!contract) {
      throw new EntityNotFoundException("Contract", id);
    }

    return res.json(contract);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
