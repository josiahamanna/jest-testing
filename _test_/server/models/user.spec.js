/**
 *@jest-environment node
 */

import User from "@models/User";
import Bcrypt from "bcryptjs";
import mongoose from "mongoose";

describe("The user model", () => {
  beforeAll(async () => {
    const conn = await mongoose.connect(
      "mongodb://localhost:27017/auth-app_test",
      {
        useNewUrlParser: true,
      }
    );
  });

  it("Should hash the password before saving to the database", async () => {
    const user = {
      name: "Test User",
      email: "test@user.com",
      password: "Testpassword",
    };

    const CreatedUser = await User.create(user);

    expect(Bcrypt.compareSync(user.password, CreatedUser.password)).toBe(true);
  });

  it("Should set the email confirm code for the user before saving the database", async () => {
    const user = {
      name: "Test User",
      email: "test@user.com",
      password: "Testpassword",
    };

    const CreatedUser = await User.create(user);

    expect(CreatedUser.emailConfirmCode).toEqual(expect.any(String));
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
});
