const { Contract } = require("../../model");
const { Op } = require("sequelize");

class ContractRepository {
  findByContractorId(contractorId, id) {
    return Contract.findOne({
      where: {
        id,
        ContractorId: contractorId,
      },
    });
  }

  findByClientId(clientId, id) {
    return Contract.findOne({
      where: {
        id,
        ClientId: clientId,
      },
    });
  }

  findAllByContractorId(contractorId) {
    return Contract.findAll({
      where: {
        ContractorId: contractorId,
        status: { [Op.ne]: "terminated" },
      },
    });
  }

  findAllByClientId(clientId) {
    return Contract.findAll({
      where: {
        ClientId: clientId,
        status: { [Op.ne]: "terminated" },
      },
    });
  }
}

exports.ContractRepository = ContractRepository;
