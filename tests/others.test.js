const { hashPassword } = require("../utils/hashPassword");

describe("testing hashing password function", () => {
  test("password has to be hashed", async () => {
    const password = "This is my password";
    const passwordHashed = await hashPassword(password);

    expect(passwordHashed).not.toBe(password);
  });
});
