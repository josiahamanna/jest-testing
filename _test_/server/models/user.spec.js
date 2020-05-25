/**
 *@jest-environment node
 */

import User from "@models/User";
import Bcrypt from "bcryptjs";
import { connect, disconnect } from "@test/utils/mongoose";
import jwt from "jsonwebtoken";
import config from "@config";

describe("The user model", () => {
  const user = {
    name: "Test User",
    email: "test@user.com",
    password: "Testpassword",
  };

  let CreatedUser;

  beforeAll(async () => {
    await connect();

    CreatedUser = await User.create(user);
  });

  it("Should hash the password before saving to the database", async () => {
    expect(Bcrypt.compareSync(user.password, CreatedUser.password)).toBe(true);
  });

  it("Should set the email confirm code for the user before saving the database", async () => {
    expect(CreatedUser.emailConfirmCode).toEqual(expect.any(String));
  });

  describe("Generate Token Method", () => {
    it("Should generate a valid jwt for a user", () => {
      const token = CreatedUser.generateToken();
      const { id } = jwt.verify(token, config.jwtSecret);
      expect(id).toEqual(JSON.parse(JSON.stringify(CreatedUser._id)));
      // alternative way of stringify
      expect(id).toEqual(String(CreatedUser._id));
    });
  });

  afterAll(async () => {
    await disconnect();
  });
});
