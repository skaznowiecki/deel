const request = require("supertest");
const app = require("../../app");

const { Profile, Contract, Job } = require("../../model");

describe("/contracts", () => {
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
        balance: 500,
        type: "client",
      }),
      Profile.create({
        id: 2,
        firstName: "Contractor",
        lastName: "#1",
        profession: "programmer",
        balance: 150,
        type: "contractor",
      }),
      Contract.create({
        id: 1,
        terms: "#1",
        status: "terminated",
        ClientId: 1,
        ContractorId: 2,
      }),
      Contract.create({
        id: 2,
        terms: "#2",
        status: "in_progress",
        ClientId: 1,
        ContractorId: 2,
      }),
      Contract.create({
        id: 3,
        terms: "#3",
        status: "new",
        ClientId: 1,
        ContractorId: 2,
      }),
    ]);
  });

  it("should return list of not terminated contracts for the client", async () => {
    const { statusCode, body } = await request(app)
      .get("/contracts")
      .set("profile_id", "1");

    expect(statusCode).toEqual(200);
    expect(body).toHaveLength(2);

    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 2,
          terms: "#2",
          status: "in_progress",
          ClientId: 1,
          ContractorId: 2,
        }),
        expect.objectContaining({
          id: 3,
          terms: "#3",
          status: "new",
          ClientId: 1,
          ContractorId: 2,
        }),
      ])
    );
  });
});

describe("/contracts/:id", () => {
  beforeEach(async () => {
    await Profile.sync({ force: true });
    await Contract.sync({ force: true });
    await Job.sync({ force: true });

    await Promise.all([
      Profile.create({
        id: 1,
        firstName: "Client",
        lastName: "#1",
        profession: "Airplane",
        balance: 150,
        type: "client",
      }),
      Profile.create({
        id: 2,
        firstName: "Contractor",
        lastName: "#1",
        profession: "programmer",
        balance: 5000,
        type: "contractor",
      }),
      Profile.create({
        id: 3,
        firstName: "Contractor",
        lastName: "#2",
        profession: "programmer",
        balance: 5000,
        type: "contractor",
      }),
      Contract.create({
        id: 1,
        terms: "#1",
        status: "terminated",
        ClientId: 1,
        ContractorId: 2,
      }),
      Contract.create({
        id: 2,
        terms: "#2",
        status: "terminated",
        ClientId: 1,
        ContractorId: 3,
      }),
    ]);
  });

  it("should return 404 when the contract does not exist", async () => {
    const { statusCode, body } = await request(app)
      .get("/contracts/1000")
      .set("profile_id", "1");

    expect(statusCode).toEqual(404);
    expect(body).toMatchObject({
      error: "Entity Contract: 1000 not found",
    });
  });

  it("should return 401 when the profile does not exist", async () => {
    const { statusCode, body } = await request(app)
      .get("/contracts/1")
      .set("profile_id", "1000");

    expect(statusCode).toEqual(401);
    expect(body).toMatchObject({
      error: "Authentication failed",
    });
  });

  it("should return 404 when the contract does not belongs to the contractor", async () => {
    const { statusCode, body } = await request(app)
      .get("/contracts/1")
      .set("profile_id", "3");

    expect(statusCode).toEqual(404);
    expect(body).toMatchObject({
      error: "Entity Contract: 1 not found",
    });
  });

  it("should return the contract when the profile matches with the client", async () => {
    const { statusCode, body } = await request(app)
      .get("/contracts/1")
      .set("profile_id", "1");

    expect(statusCode).toEqual(200);
    expect(body).toMatchObject({
      id: 1,
      terms: "#1",
      status: "terminated",
      ClientId: 1,
      ContractorId: 2,
    });
  });

  it("should return the contract when the profile matches with the contractor", async () => {
    const { statusCode, body } = await request(app)
      .get("/contracts/1")
      .set("profile_id", "2");

    expect(statusCode).toEqual(200);
    expect(body).toMatchObject({
      id: 1,
      terms: "#1",
      status: "terminated",
      ClientId: 1,
      ContractorId: 2,
    });
  });
});
