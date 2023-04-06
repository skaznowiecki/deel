const EntityNotFoundException = require("../../exceptions/entityNotFound");
const ValidationException = require("../../exceptions/validation");

const { JobRepository } = require("./repositories/jobRepository");
const { ProfileRepository } = require("./repositories/profileRepository");

class JobService {
  constructor() {
    this.jobRepository = new JobRepository();
    this.profileRepository = new ProfileRepository();
  }

  async findAllUnPaidJobs(profile) {
    return await this.jobRepository.findAllUnPaidJobs(profile.type, profile.id);
  }

  async payJob(client, jobId) {
    if (client.type === "contractor") {
      throw new ValidationException("Contractor can not pay for the job");
    }

    const job = await this.jobRepository.findById(jobId, client.id);

    if (!job) {
      throw new EntityNotFoundException("Job", jobId);
    }

    if (job.paid) {
      throw new ValidationException("Job is already paid");
    }

    if (client.balance < job.price) {
      throw new ValidationException("Not enough money on the balance");
    }

    const contractor = await this.profileRepository.findById(
      job.Contract.ContractorId
    );

    const clientBalance = client.balance - job.price;
    const contractorBalance = contractor.balance + job.price;

    const paymentDate = new Date().toISOString();

    //run transaction
    await this.jobRepository.payJob(
      client.id,
      clientBalance,
      contractor.id,
      contractorBalance,
      jobId,
      paymentDate
    );

    job.paid = true;
    job.paymentDate = paymentDate;

    return job;
  }
}

exports.JobService = JobService;
