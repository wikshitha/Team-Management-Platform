import {
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import jwt from "jsonwebtoken";

import generateToken from "../src/utils/generateToken.js";

describe("generateToken", () => {
  const originalSecret = process.env.JWT_SECRET;
  const originalExpiry = process.env.JWT_EXPIRES_IN;

  beforeEach(() => {
    process.env.JWT_SECRET = "day12-test-secret";
    process.env.JWT_EXPIRES_IN = "7d";
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalSecret;
    process.env.JWT_EXPIRES_IN = originalExpiry;
  });

  it("creates a valid JWT", () => {
    const token = generateToken({
      id: "user-123",
      role: {
        name: "ADMIN",
      },
    });

    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(20);
  });

  it("stores the user id and role inside the token", () => {
    const token = generateToken({
      id: "user-123",
      role: {
        name: "PROJECT_MANAGER",
      },
    });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    expect(decoded.userId).toBe("user-123");
    expect(decoded.role).toBe("PROJECT_MANAGER");
  });

  it("throws when JWT_SECRET is missing", () => {
    delete process.env.JWT_SECRET;

    expect(() =>
      generateToken({
        id: "user-123",
        role: {
          name: "ADMIN",
        },
      })
    ).toThrow("JWT_SECRET is not configured.");
  });
});