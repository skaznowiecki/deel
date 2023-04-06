const request = require("supertest");
const app = require("../../app");
const { Profile, Contract, Job } = require("../../model");

describe("/balances/deposit/:userId", () => {
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
      Contract.create({
        id: 1,
        terms: "#1",
        status: "in_progress",
        ClientId: 1,
        ContractorId: 2,
      }),
      Job.create({
        id: 1,
        description: "#1",
        price: 200,
        ContractId: 1,
        paid: true,
        paymentDate: "2023-04-06T05:10:20.757Z",
      }),
      Job.create({
        id: 2,
        description: "#2",
        price: 200,
        ContractId: 1,
        paid: false,
      }),
      Job.create({
        id: 3,
        description: "#3",
        price: 300,
        ContractId: 1,
        paid: false,
      }),
    ]);
  });

  it("should return 404 if client does not exist", async () => {
    const { statusCode, body } = await request(app)
      .post("/balances/deposit/1000")
      .set("profile_id", "1")
      .send({ amount: 100 });

    expect(statusCode).toEqual(404);
    expect(body).toMatchObject({
      error: "Entity Client: 1000 not found",
    });
  });

  it("should return 422 if the user id is not a client", async () => {
    const { statusCode, body } = await request(app)
      .post("/balances/deposit/2")
      .set("profile_id", "1")
      .send({ amount: 100 });

    expect(statusCode).toEqual(422);
    expect(body).toMatchObject({
      error: "Only clients can deposit money",
    });
  });

  it("should return 422 if deposit exceeds the limit of 0.25 of unpaid jobs total", async () => {
    const { statusCode, body } = await request(app)
      .post("/balances/deposit/1")
      .set("profile_id", "1")
      .send({ amount: 1000 });

    expect(statusCode).toEqual(422);
    expect(body).toMatchObject({
      error: "Deposit limit exceeded",
    });
  });

  it("should return the client with the new balance", async () => {
    const { statusCode, body } = await request(app)
      .post("/balances/deposit/1")
      .set("profile_id", "1")
      .send({ amount: 100 });

    expect(statusCode).toEqual(200);
    expect(body).toEqual(
      expect.objectContaining({
        id: 1,
        firstName: "Client",
        lastName: "#1",
        profession: "airplane",
        balance: 1100,
        type: "client",
      })
    );

    const client = await Profile.findByPk(1);

    expect(client.balance).toEqual(1100);
  });
});
