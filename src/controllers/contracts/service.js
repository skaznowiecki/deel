const { ContractRepository } = require("./repositories/contractRepository");

class ContractService {
  constructor() {
    this.contractRepository = new ContractRepository();
  }

  async get(profile, id) {
    if (profile.type === "client") {
      return this.contractRepository.findByClientId(profile.id, id);
    } else if (profile.type === "contractor") {
      return this.contractRepository.findByContractorId(profile.id, id);
    }
  }

  async list(profile) {
    if (profile.type === "client") {
      return this.contractRepository.findAllByClientId(profile.id);
    } else if (profile.type === "contractor") {
      return this.contractRepository.findAllByContractorId(profile.id);
    }
  }
}

exports.ContractService = ContractService;
