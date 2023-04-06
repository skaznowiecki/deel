const { Op } = require("sequelize");
const { Profile, Job, Contract } = require("../../../model");

class ClientRepository {
  async getTotalUnPaidJobs(clientId) {
    const sum = await Job.sum("price", {
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
            status: "in_progress",
            ClientId: clientId,
          },
        },
      ],
    });

    return sum === null ? 0 : sum;
  }
  findById(clientId) {
    return Profile.findByPk(clientId);
  }
  updateBalance(clientId, balance) {
    return Profile.update(
      {
        balance,
      },
      {
        where: {
          id: clientId,
        },
      }
    );
  }
}

exports.ClientRepository = ClientRepository;
