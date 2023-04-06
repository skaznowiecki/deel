const request = require("supertest");
const app = require("../../app");
const { Profile, Contract, Job } = require("../../model");

describe("/admin/best-profession", () => {
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
        balance: 100,
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
        profession: "designer",
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
      Contract.create({
        id: 2,
        terms: "#1",
        status: "in_progress",
        ClientId: 1,
        ContractorId: 3,
      }),
      Job.create({
        id: 1,
        description: "Programming. Outside of the range",
        price: 5000,
        ContractId: 1,
        paid: true,
        paymentDate: "2022-01-01T18:10:23.737Z",
        createdAt: "2022-01-01T18:10:23.737Z",
      }),
      Job.create({
        id: 2,
        description: "Programming. In the range",
        price: 200,
        ContractId: 1,
        paid: true,
        paymentDate: "2023-03-01T18:10:23.737Z",
        createdAt: "2023-03-01T18:10:23.737Z",
      }),
      Job.create({
        id: 3,
        description: "Design. In the rang",
        price: 500,
        ContractId: 2,
        paid: true,
        paymentDate: "2023-03-01T18:10:23.737Z",
        createdAt: "2023-03-01T18:10:23.737Z",
      }),
    ]);
  });

  it("should return the profession with the highest income between start and end date", async () => {
    const { statusCode, body } = await request(app)
      .get("/admin/best-profession")
      .query({ start: "2023-01-01" })
      .query({ end: "2023-05-01" });

    expect(statusCode).toEqual(200);
    expect(body).toEqual(
      expect.objectContaining({
        profession: "designer",
        total: 500,
      })
    );
  });
});
