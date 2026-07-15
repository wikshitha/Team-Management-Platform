import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  authorizeRoles,
} from "../src/middleware/roleMiddleware.js";

const createResponse = () => {
  const res = {};

  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);

  return res;
};

describe("authorizeRoles middleware", () => {
  it("returns 401 when authenticated user is missing", () => {
    const req = {};
    const res = createResponse();
    const next = vi.fn();

    const middleware = authorizeRoles("ADMIN");

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Authentication is required.",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when the user's role is not allowed", () => {
    const req = {
      user: {
        role: {
          name: "TEAM_MEMBER",
        },
      },
    };

    const res = createResponse();
    const next = vi.fn();

    const middleware = authorizeRoles(
      "ADMIN",
      "PROJECT_MANAGER"
    );

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message:
        "You do not have permission to perform this action.",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("allows an Administrator to continue", () => {
    const req = {
      user: {
        role: {
          name: "ADMIN",
        },
      },
    };

    const res = createResponse();
    const next = vi.fn();

    const middleware = authorizeRoles(
      "ADMIN",
      "PROJECT_MANAGER"
    );

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("allows a Project Manager when the role is permitted", () => {
    const req = {
      user: {
        role: {
          name: "PROJECT_MANAGER",
        },
      },
    };

    const res = createResponse();
    const next = vi.fn();

    const middleware = authorizeRoles(
      "ADMIN",
      "PROJECT_MANAGER"
    );

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("rejects a user whose role object is missing", () => {
    const req = {
      user: {
        id: "user-id",
      },
    };

    const res = createResponse();
    const next = vi.fn();

    const middleware = authorizeRoles("ADMIN");

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});