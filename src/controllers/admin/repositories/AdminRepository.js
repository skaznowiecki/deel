const { Op } = require("sequelize");
const { Profile, Job, Contract, sequelize } = require("../../../model");

class AdminRepository {
  async getBestProfession(start, end) {
    return Job.findAll({
      attributes: [[sequelize.fn("sum", sequelize.col("price")), "total"]],
      order: [[sequelize.fn("sum", sequelize.col("price")), "DESC"]],
      group: ["Contract.Contractor.profession"],
      limit: 1,
      where: {
        paid: true,
        createdAt: {
          [Op.between]: [start, end],
        },
      },
      include: [
        {
          model: Contract,
          attributes: ["createdAt"],
          include: [
            {
              model: Profile,
              as: "Contractor",
              where: { type: "contractor" },
              attributes: ["profession"],
            },
          ],
        },
      ],
    });
  }

  async getBestClients(start, end, limit) {
    return Job.findAll({
      attributes: [[sequelize.fn("sum", sequelize.col("price")), "total"]],
      order: [[sequelize.fn("sum", sequelize.col("price")), "DESC"]],
      group: ["Contract.Client.id"],
      limit,
      where: {
        paid: true,
        paymentDate: {
          [Op.between]: [start, end],
        },
      },
      include: [
        {
          model: Contract,
          attributes: ["id"],
          include: [
            {
              model: Profile,
              as: "Client",
              where: { type: "client" },
              attributes: ["id", "firstName", "lastName"],
            },
          ],
        },
      ],
    });
  }
}

exports.AdminRepository = AdminRepository;
