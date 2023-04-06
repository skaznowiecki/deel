const EntityNotFoundException = require("../../exceptions/entityNotFound");
const ValidationException = require("../../exceptions/validation");

const { ClientRepository } = require("./repositories/ClientRepository");

class BalanceService {
  constructor() {
    this.clientRepository = new ClientRepository();
  }

  async deposit(clientId, amount) {
    const [client, unpaidTotal] = await Promise.all([
      this.clientRepository.findById(clientId),
      this.clientRepository.getTotalUnPaidJobs(clientId),
    ]);
    if (!client) {
      throw new EntityNotFoundException("Client", clientId);
    }

    if (client.type !== "client") {
      throw new ValidationException("Only clients can deposit money");
    }

    const depositLimit = unpaidTotal * 0.25;

    if (amount > depositLimit) {
      throw new ValidationException(`Deposit limit exceeded`);
    }

    const newBalance = client.balance + amount;

    await this.clientRepository.updateBalance(clientId, newBalance);

    client.balance = newBalance;

    return client;
  }
}

exports.BalanceService = BalanceService;
