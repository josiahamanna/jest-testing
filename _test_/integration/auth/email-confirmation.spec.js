/**
 * @jest-environment node
 */

import server from "@server/app";
import supertest from "supertest";
import { disconnect } from "@test/utils/mongoose";
import User from "@models/User";
import chalk from "chalk";

const app = () => supertest(server);

beforeEach(async () => {
  await User.deleteMany({});
});

describe("The register process", () => {
  // prepare
  const EMAIL_CONFIRMATION_URL = "/api/v1/auth/emails/confirm";
  const user = {
    name: "test user",
    email: "email@user.com",
    password: "password",
  };

  it("Should return 422 while confirming email", async () => {
    const confirmEmail = await app()
      .post(EMAIL_CONFIRMATION_URL)
      .send({ token: "xxx" });

    expect(confirmEmail.status).toBe(422);
    expect(confirmEmail.body.message).toBe("Validation failed.");
  });

  it("should return 200 on success full verificaion", async () => {
    const createdUser = await User.create(user);

    const confirmEmail = await app()
      .post(EMAIL_CONFIRMATION_URL)
      .send({ token: createdUser.emailConfirmCode });

    expect(confirmEmail.status).toBe(200);
    expect(confirmEmail.body.data.user.emailConfirmCode).toBeNull();
    expect(confirmEmail.body.data.user.emailConfirmedAt).toBeDefined();

    const freshUser = await User.findOne({ email: createdUser.email });
    // expect(freshUser.emailConfirmCode).toBeNull();
    expect(freshUser.emailConfirmedAt).toBeDefined();
  });

  afterAll(async () => {
    await disconnect();
  });
});
