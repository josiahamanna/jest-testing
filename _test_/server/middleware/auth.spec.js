/**
 *@jest-environment node
 */

import User from "@models/User";
import { connect, disconnect } from "@test/utils/mongoose";
import jwt from "jsonwebtoken";
import config from "@config";
import authMiddleware from "@middleware/auth";
import Response from "@test/utils/response";

describe("The auth middleware", () => {
  const user = {
    name: "Test User",
    email: "test@user.com",
    password: "testpassword",
  };

  let CreatedUser;

  beforeAll(async () => {
    await connect();

    CreatedUser = await User.create(user);
  });

  it("should call next function if authentication is successfull", async () => {
    const access_token = CreatedUser.generateToken();

    const req = {
      body: {
        access_token,
      },
    };

    const res = new Response();

    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return a 401 if authentication fails", async () => {
    const req = {
      body: {
        access_token: "",
      },
    };

    const res = new Response();

    const statusSpy = jest.spyOn(res, "status");
    const jsonSpy = jest.spyOn(res, "json");
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(0);
    expect(statusSpy).toHaveBeenCalledWith(401);
    expect(jsonSpy).toHaveBeenCalledWith({
      message: "Unauthenticated.",
    });
  });

  afterAll(async () => {
    await disconnect;
  });
});
