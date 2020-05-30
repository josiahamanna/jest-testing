/**
 * @jest-environment node
 */

import server from "@server/app";
import supertest from "supertest";
import { disconnect } from "@test/utils/mongoose";
import User from "@models/User";

const app = () => supertest(server);

beforeEach(async () => {
  await User.deleteMany({});
});

describe("The register process", () => {
  // prepare
  const REGISTATION_URL = "/api/v1/auth/register";
  const user = {
    name: "test user",
    email: "email@user.com",
    password: "password",
  };

  it("should register a new user", async () => {
    const response = await app().post(REGISTATION_URL).send(user);

    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
    expect(response.body.message).toBe("Account registered.");
  });

  it("Should fail with error code 422", async () => {
    // prepare
    await User.create(user);

    // action
    const response = await app().post(REGISTATION_URL).send(user);

    // assert
    expect(response.status).toBe(422);
    expect(response.body.message).toBe("Validation failed.");
    expect(response.body.data.errors).toEqual({
      email: "This email has already been taken.",
    });
  });

  afterAll(async () => {
    await disconnect();
  });
});
