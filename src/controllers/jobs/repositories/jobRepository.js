const { Op } = require("sequelize");
const { Contract, Job, Profile, sequelize } = require("../../../model");

class JobRepository {
  findAllUnPaidJobs(type, profileId) {
    const profileTypeKey = type === "client" ? "ClientId" : "ContractorId";

    return Job.findAll({
      where: {
        [Op.or]: [
          {
            paid: false,
          },
          {
            paid: null,
          },
        ],
      },
      include: [
        {
          model: Contract,
          required: true,
          attributes: [],
          where: {
            [Op.or]: [
              {
                [profileTypeKey]: profileId,
              },
            ],
            status: "in_progress",
          },
        },
      ],
    });
  }

  findById(id, clientId) {
    return Job.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Contract,
          required: true,
          attributes: ["ContractorId"],
          where: {
            ClientId: clientId,
          },
        },
      ],
    });
  }

  payJob(
    clientId,
    clientBalance,
    contractorId,
    contractorBalance,
    jobId,
    paymentDate
  ) {
    return sequelize.transaction(async (t) => {
      await Promise.all([
        Profile.update(
          { balance: clientBalance },
          { where: { id: clientId }, transaction: t }
        ),
        Profile.update(
          { balance: contractorBalance },
          { where: { id: contractorId }, transaction: t }
        ),
        Job.update(
          { paid: true, paymentDate },
          { where: { id: jobId }, transaction: t }
        ),
      ]);
    });
  }
}

exports.JobRepository = JobRepository;
