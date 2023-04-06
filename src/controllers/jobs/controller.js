const { JobService } = require("./service");

const { Router } = require("express");

const router = new Router();

const service = new JobService();

router.get("/unpaid", async (req, res) => {
  const profile = req.profile;

  const jobs = await service.findAllUnPaidJobs(profile);

  return res.json(jobs);
});

router.post("/:job_id/pay", async (req, res, next) => {
  const { job_id } = req.params;
  const profile = req.profile;

  try {
    const result = await service.payJob(profile, job_id);

    return res.json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
