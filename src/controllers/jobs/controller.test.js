const request = require("supertest");
const app = require("../../app");

const { Profile, Contract, Job } = require("../../model");

describe("/jobs/unpaid", () => {
  beforeEach(async () => {
    await Profile.sync({ force: true });
    await Contract.sync({ force: true });
    await Job.sync({ force: true });

    await Promise.all([
      Profile.create({
        id: 1,
        firstName: "Client",
        lastName: "#1",
        profession: "airplane",
        balance: 1000,
        type: "client",
      }),
      Profile.create({
        id: 2,
        firstName: "Contractor",
        lastName: "#1",
        profession: "programmer",
        balance: 100,
        type: "contractor",
      }),
      Profile.create({
        id: 3,
        firstName: "Contractor",
        lastName: "#2",
        profession: "programmer",
        balance: 200,
        type: "contractor",
      }),
      Contract.create({
        id: 1,
        terms: "#1",
        status: "in_progress",
        ClientId: 1,
        ContractorId: 2,
      }),
      Contract.create({
        id: 2,
        terms: "#2",
        status: "new",
        ClientId: 1,
        ContractorId: 3,
      }),
      Job.create({
        id: 1,
        description: "#1",
        price: 50,
        ContractId: 1,
        paid: true,
        paymentDate: "2020-08-15T19:11:26.737Z",
      }),
      Job.create({
        id: 2,
        description: "#2",
        price: 50,
        ContractId: 1,
        paid: false,
      }),
      Job.create({
        id: 3,
        description: "#3",
        price: 50,
        ContractId: 1,
      }),
      Job.create({
        id: 4,
        description: "#4",
        price: 50,
        ContractId: 2,
        paid: false,
      }),
    ]);
  });

  it("should return list of unpaid jobs", async () => {
    const { statusCode, body } = await request(app)
      .get("/jobs/unpaid")
      .set("profile_id", "1");

    expect(statusCode).toEqual(200);
    expect(body).toHaveLength(2);

    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 2,
          description: "#2",
          price: 50,
          ContractId: 1,
          paid: false,
        }),
        expect.objectContaining({
          id: 3,
          description: "#3",
          price: 50,
          ContractId: 1,
        }),
      ])
    );
  });

  it("should return unpaid jobs only for contracts which are in_progress", async () => {
    const { statusCode, body } = await request(app)
      .get("/jobs/unpaid")
      .set("profile_id", "3");

    expect(statusCode).toEqual(200);
    expect(body).toHaveLength(0);
  });
});

describe("/jobs/:id/pay", () => {
  beforeEach(async () => {
    await Profile.sync({ force: true });
    await Contract.sync({ force: true });
    await Job.sync({ force: true });

    await Promise.all([
      Profile.create({
        id: 1,
        firstName: "Client",
        lastName: "#1",
        profession: "airplane",
        balance: 1000,
        type: "client",
      }),
      Profile.create({
        id: 2,
        firstName: "Contractor",
        lastName: "#1",
        profession: "programmer",
        balance: 200,
        type: "contractor",
      }),
      Contract.create({
        id: 1,
        terms: "#1",
        status: "in_progress",
        ClientId: 1,
        ContractorId: 2,
      }),
      Job.create({
        id: 1,
        description: "job which can be paid",
        price: 100,
        ContractId: 1,
        paid: false,
      }),
      Job.create({
        id: 2,
        description: "job which exceeds client's balance",
        price: 1100,
        ContractId: 1,
        paid: false,
      }),
      Job.create({
        id: 3,
        description: "job paid",
        price: 200,
        ContractId: 1,
        paid: true,
        paymentDate: "2020-08-15T19:11:26.737Z",
      }),
    ]);
  });

  it("should return 404 when job is does not exist", async () => {
    const { statusCode, body } = await request(app)
      .post("/jobs/1000/pay")
      .set("profile_id", "1");

    expect(statusCode).toEqual(404);
    expect(body).toMatchObject({
      error: "Entity Job: 1000 not found",
    });
  });

  it("should return 422 when the profile is not a client", async () => {
    const { statusCode, body } = await request(app)
      .post("/jobs/1/pay")
      .set("profile_id", "2");

    expect(statusCode).toEqual(422);
    expect(body).toMatchObject({
      error: "Contractor can not pay for the job",
    });
  });

  it("should return 422 when the job is already paid", async () => {
    const { statusCode, body } = await request(app)
      .post("/jobs/3/pay")
      .set("profile_id", "1");

    expect(statusCode).toEqual(422);
    expect(body).toMatchObject({
      error: "Job is already paid",
    });
  });

  it("should return 422 when the job exceeds client's balance", async () => {
    const { statusCode, body } = await request(app)
      .post("/jobs/2/pay")
      .set("profile_id", "1");

    expect(statusCode).toEqual(422);
    expect(body).toMatchObject({
      error: "Not enough money on the balance",
    });
  });

  it("should return the job updated and the money moved from the client to the contractor", async () => {
    const { statusCode } = await request(app)
      .post("/jobs/1/pay")
      .set("profile_id", "1");

    expect(statusCode).toEqual(200);

    const [job, client, contractor] = await Promise.all([
      Job.findByPk(1),
      Profile.findByPk(1),
      Profile.findByPk(2),
    ]);

    expect(client.balance).toEqual(900);
    expect(contractor.balance).toEqual(300);
    expect(job.paid).toEqual(true);
    expect(job.paymentDate).toBeDefined();
  });
});
