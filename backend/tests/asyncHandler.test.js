import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import asyncHandler from "../src/utils/asyncHandler.js";

describe("asyncHandler", () => {
  it("runs a successful asynchronous controller", async () => {
    const req = {};
    const res = {};
    const next = vi.fn();

    const controller = vi.fn(
      async (_req, response) => {
        response.completed = true;
      }
    );

    const wrappedController =
      asyncHandler(controller);

    await wrappedController(req, res, next);

    expect(controller).toHaveBeenCalledWith(
      req,
      res,
      next
    );

    expect(res.completed).toBe(true);
    expect(next).not.toHaveBeenCalled();
  });

  it("forwards rejected errors to error middleware", async () => {
    const req = {};
    const res = {};
    const next = vi.fn();

    const error = new Error(
      "Controller failed"
    );

    const controller = async () => {
      throw error;
    };

    const wrappedController =
      asyncHandler(controller);

    await wrappedController(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});