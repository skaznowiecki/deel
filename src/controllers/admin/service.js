const EntityNotFoundException = require("../../exceptions/entityNotFound");
const ValidationException = require("../../exceptions/validation");

const { AdminRepository } = require("./repositories/AdminRepository");

class AdminService {
  constructor() {
    this.adminRepository = new AdminRepository();
  }

  async getBestProfession(start, end) {
    const results = await this.adminRepository.getBestProfession(start, end);

    if (!results || !results.length) {
      return {};
    }

    const result = results[0];

    return {
      profession: result.Contract.Contractor.profession,
      total: result.dataValues.total,
    };
  }

  async getBestClients(start, end, limit) {
    const results = await this.adminRepository.getBestClients(
      start,
      end,
      limit
    );

    if (!results || !results.length) {
      return [];
    }

    return results.map((result) => ({
      id: result.Contract.Client.id,
      fullName: `${result.Contract.Client.firstName} ${result.Contract.Client.lastName}`,
      paid: result.dataValues.total,
    }));
  }
}

exports.AdminService = AdminService;
